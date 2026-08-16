import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { sendEmailNotification } from "@/lib/mailer";
import { generateConfirmationEmailHTML } from "@/lib/invoice";
import { syncBookingToGoogleSheet } from "@/lib/googlesheets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature") || "";
    const timestamp = request.headers.get("x-webhook-timestamp") || "";

    // 1. Verify Webhook HMAC Signature
    const isValidSignature = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);

    if (!isValidSignature) {
      console.warn("Cashfree Webhook Signature Mismatch Warning");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Parse Webhook Event Body
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
      return NextResponse.json({ status: "OK", message: "Ignored: No orderId" });
    }

    // Find payment record in database
    const paymentRecord = await prisma.payment.findFirst({
      where: { cashfreeOrderId: orderId },
      include: {
        booking: {
          include: { customer: true, room: true },
        },
      },
    });

    if (!paymentRecord || !paymentRecord.booking) {
      console.warn(`Cashfree Webhook: Payment record for order ${orderId} not found`);
      return NextResponse.json({ status: "OK", message: "Payment record not found" });
    }

    const booking = paymentRecord.booking;

    // 3. Idempotent Processing Check
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({
        status: "OK",
        message: "Idempotent: Booking already confirmed",
      });
    }

    // 4. Process Payment Success Event
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

      // Trigger Email Confirmation (Non-blocking: failures will not reverse confirmed booking)
      if (booking.customer.email) {
        try {
          const emailHtml = generateConfirmationEmailHTML({
            bookingReference: booking.referenceId,
            customerName: booking.customer.name,
            customerPhone: booking.customer.phone,
            customerEmail: booking.customer.email,
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
            paymentMethod: "UPI / Cards (Cashfree Webhook Verified)",
            gstin: "10AAAAA0000A1Z5",
            createdAt: new Date(),
            hotelAddress: "Kachari Chowk, MG Road, Bhagalpur, Bihar - 812001",
            hotelPhone: "+91 93081 89201 / +91 641 2400000",
            googleMapsUrl: "https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9",
            railwayDistance: "Bhagalpur Junction Railway Station (BGP): ~2.5 km (10-15 mins drive)",
          });

          const isSent = await sendEmailNotification({
            to: booking.customer.email,
            subject: `Booking Confirmed (${booking.referenceId}) - Hotel Rajhans International`,
            html: emailHtml,
          });

          await prisma.auditLog.create({
            data: {
              userId: null,
              userName: "System (Cashfree Webhook)",
              action: "SEND_CONFIRMATION_EMAIL",
              entity: "Booking",
              entityId: booking.id,
              details: isSent
                ? `Webhook confirmation email delivered to ${booking.customer.email}`
                : `Webhook email dispatch logged (Simulation / SMTP response) for ${booking.customer.email}`,
            },
          });
        } catch (emailErr) {
          console.error("Cashfree Webhook Email Send Error:", emailErr);
        }
      }

      // Synchronize Confirmed Booking to Google Sheets (Non-blocking & Idempotent)
      try {
        const syncRes = await syncBookingToGoogleSheet({
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
        });

        await prisma.auditLog.create({
          data: {
            userId: null,
            userName: "System (Cashfree Webhook Sync)",
            action: "SYNC_GOOGLE_SHEETS",
            entity: "Booking",
            entityId: booking.id,
            details: syncRes.duplicated
              ? `Google Sheets webhook sync skipped (Reference ${booking.referenceId} already exists)`
              : syncRes.success
              ? `Synced ${booking.referenceId} to Google Sheets ('Bookings' tab)`
              : `Google Sheets webhook sync failed for ${booking.referenceId}`,
          },
        });
      } catch (sheetErr) {
        console.error("Non-blocking webhook Google Sheets sync error:", sheetErr);
      }
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Cashfree Webhook Processing Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
