import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchCashfreeOrderPayments } from "@/lib/cashfree";
import { sendEmailNotification } from "@/lib/mailer";
import { generateConfirmationEmailHTML } from "@/lib/invoice";
import { syncBookingToGoogleSheet } from "@/lib/googlesheets";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { bookingId, orderId } = body;

    if (!bookingId || !orderId) {
      return NextResponse.json(
        { success: false, error: "Booking ID and Order ID are required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, room: true, payments: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    // 1. Idempotency Check: Skip duplicate processing if already CONFIRMED
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({
        success: true,
        status: "CONFIRMED",
        bookingReference: booking.referenceId,
        message: "Booking is already confirmed.",
      });
    }

    const refId = booking.referenceId;

    // 2. Fetch Order & Payment Status from Cashfree PG
    const { orderStatus, payments } = await fetchCashfreeOrderPayments(orderId);
    const successfulPayment = payments.find(
      (p) => p.payment_status === "SUCCESS"
    );

    const isVerified =
      orderStatus.toUpperCase() === "PAID" ||
      orderStatus.toUpperCase() === "SUCCESS" ||
      Boolean(successfulPayment);

    if (!isVerified) {
      return NextResponse.json(
        {
          success: false,
          status: "PENDING",
          error: "Payment verification pending or not settled.",
          bookingReference: refId,
        },
        { status: 200 }
      );
    }

    const paymentId = successfulPayment?.cf_payment_id || `cf_pay_${orderId}`;

    // 3. Atomic Database Update Transaction
    await prisma.$transaction(async (tx) => {
      const paymentUpdate = await tx.payment.updateMany({
        where: { bookingId: booking.id, cashfreeOrderId: orderId },
        data: {
          cashfreePaymentId: paymentId,
          status: "SUCCESS",
          gatewayResponse: JSON.stringify({ verified: true, orderStatus, payments }),
        },
      });

      if (paymentUpdate.count === 0) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            cashfreeOrderId: orderId,
            cashfreePaymentId: paymentId,
            amount: booking.netAmount,
            currency: "INR",
            method: "UPI",
            status: "SUCCESS",
            gatewayResponse: JSON.stringify({ verified: true, orderStatus, payments }),
          },
        });
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: "CONFIRMED",
          paidAmount: booking.netAmount,
        },
      });
    });

    // 4. Non-blocking Post-Payment Notifications (Guest + Hotel Admin Copy)
    try {
      const emailHtml = generateConfirmationEmailHTML({
        bookingReference: refId,
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
        paymentMethod: "Cashfree PG Verified",
        gstin: "10AAAAA0000A1Z5",
        createdAt: new Date(),
        hotelAddress: "Kachari Chowk, MG Road, Bhagalpur, Bihar - 812001",
        hotelPhone: "+91 93081 89201 / +91 641 2400000",
        googleMapsUrl: "https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9",
        railwayDistance: "Bhagalpur Junction Railway Station (BGP): ~2.5 km (10-15 mins drive)",
      });

      // Send to both Guest & Hotel Official Admin Inbox
      const recipientEmails = Array.from(
        new Set([
          booking.customer.email,
          "info@hotelrajhansinternational.com",
          "rajhansinternational.info@gmail.com",
        ].filter(Boolean))
      ).join(", ");

      sendEmailNotification({
        to: recipientEmails,
        subject: `New Confirmed Booking (${refId}) - Hotel Rajhans International`,
        html: emailHtml,
      }).catch((err) => console.error("Non-blocking email send error:", err));
    } catch (err) {
      console.error("Confirmation email template generation error:", err);
    }

    try {
      syncBookingToGoogleSheet({
        bookingReference: refId,
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
      }).catch((err) => console.error("Non-blocking Google Sheets sync error:", err));
    } catch (err) {
      console.error("Google Sheets payload error:", err);
    }

    return NextResponse.json(
      {
        success: true,
        status: "CONFIRMED",
        bookingReference: refId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Verify Cashfree Payment Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
