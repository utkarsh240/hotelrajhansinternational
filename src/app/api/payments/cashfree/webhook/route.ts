import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { sendEmailNotification } from "@/lib/mailer";
import { generateConfirmationEmailHTML } from "@/lib/invoice";
import { syncBookingToGoogleSheet } from "@/lib/googlesheets";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    // 1. Read Raw Body (Crucial for HMAC SHA256 calculation)
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature") || "";
    const timestamp = request.headers.get("x-webhook-timestamp") || "";

    // 2. Cryptographic Signature Verification
    const isValidSignature = verifyCashfreeWebhookSignature(rawBody, timestamp, signature);

    if (!isValidSignature) {
      console.warn("Cashfree Webhook Signature Verification Failed:", {
        signature,
        timestamp,
        bodyPreview: rawBody.slice(0, 100),
      });
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    // 3. Parse JSON Body
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventType = payload.type || payload.event;
    const orderData = payload.data?.order || payload.order || {};
    const paymentData = payload.data?.payment || payload.payment || {};

    const orderId = orderData.order_id || payload.order_id;
    const paymentId = paymentData.cf_payment_id || paymentData.payment_id;
    const paymentStatus = paymentData.payment_status || orderData.order_status;

    if (!orderId) {
      return NextResponse.json({ status: "OK", message: "Ignored: Missing orderId" }, { status: 200 });
    }

    // 4. Find Payment Record in Database
    const paymentRecord = await prisma.payment.findFirst({
      where: { cashfreeOrderId: orderId },
      include: {
        booking: {
          include: { customer: true, room: true },
        },
      },
    });

    if (!paymentRecord || !paymentRecord.booking) {
      console.warn(`Cashfree Webhook: Payment record for order ${orderId} not found.`);
      return NextResponse.json({ status: "OK", message: "Payment record not found" }, { status: 200 });
    }

    const booking = paymentRecord.booking;

    // 5. Idempotent Skip
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({ status: "OK", message: "Idempotent: Booking already confirmed" }, { status: 200 });
    }

    // 6. Process Payment Success Event
    if (
      eventType === "PAYMENT_SUCCESS_WEBHOOK" ||
      paymentStatus === "SUCCESS" ||
      orderData.order_status === "PAID"
    ) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            cashfreePaymentId: String(paymentId || `cf_pay_${Date.now()}`),
            status: "SUCCESS",
            gatewayResponse: rawBody,
          },
        }),
        prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "CONFIRMED",
            paidAmount: booking.netAmount,
          },
        }),
      ]);

      // Non-blocking Email Notification (Guest + Hotel Official Admin Inbox)
      try {
        const emailHtml = generateConfirmationEmailHTML({
          bookingReference: booking.referenceId,
          customerName: booking.customer.name,
          customerPhone: booking.customer.phone,
          customerEmail: booking.customer.email || "N/A",
          customerAddress: booking.customer.address,
          roomName: booking.room.name,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guestsCount: booking.guestsCount,
          roomsCount: 1,
          basePrice: booking.room.basePriceDouble,
          totalAmount: booking.totalAmount,
          taxAmount: booking.taxAmount,
          discountAmount: booking.discountAmount,
          netAmount: booking.netAmount,
          paidAmount: booking.netAmount,
          paymentStatus: "SUCCESS",
          paymentMethod: "Cashfree Webhook Verified",
          gstin: "10AAAAA0000A1Z5",
          createdAt: new Date(),
          hotelAddress: "Kachari Chowk, MG Road, Bhagalpur, Bihar - 812001",
          hotelPhone: "+91 93081 89201 / +91 641 2400000",
          googleMapsUrl: "https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9",
          railwayDistance: "Bhagalpur Junction Railway Station (BGP): ~2.5 km (10-15 mins drive)",
        });

        const recipientEmails = Array.from(
          new Set([
            booking.customer.email,
            "info@hotelrajhansinternational.com",
            "rajhansinternational.info@gmail.com",
          ].filter(Boolean))
        ).join(", ");

        sendEmailNotification({
          to: recipientEmails,
          subject: `New Confirmed Booking (${booking.referenceId}) - Hotel Rajhans International`,
          html: emailHtml,
        }).catch((err) => console.error("Webhook email notification error:", err));

        prisma.auditLog
          .create({
            data: {
              userId: null,
              userName: "System (Cashfree Webhook)",
              action: "SEND_CONFIRMATION_EMAIL",
              entity: "Booking",
              entityId: booking.id,
              details: `Webhook confirmation email dispatched to ${recipientEmails}`,
            },
          })
          .catch(() => {});
      } catch (mailErr) {
        console.error("Webhook email formatting error:", mailErr);
      }

      // Non-blocking Google Sheets Synchronization
      try {
        syncBookingToGoogleSheet({
          bookingReference: booking.referenceId,
          bookingDate: booking.createdAt,
          customerName: booking.customer.name,
          phone: booking.customer.phone,
          email: booking.customer.email,
          roomName: booking.room.name,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guestsCount: booking.guestsCount,
          netAmount: booking.netAmount,
          paymentStatus: "SUCCESS",
          bookingStatus: "CONFIRMED",
        }).catch((err) => console.error("Webhook Google Sheets sync error:", err));
      } catch (sheetErr) {
        console.error("Webhook Google Sheets payload error:", sheetErr);
      }
    }

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Cashfree Webhook Exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
