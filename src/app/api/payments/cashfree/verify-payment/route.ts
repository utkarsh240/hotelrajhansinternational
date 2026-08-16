import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchCashfreeOrderPayments } from "@/lib/cashfree";
import { sendEmailNotification } from "@/lib/mailer";
import { generateConfirmationEmailHTML } from "@/lib/invoice";
import { syncBookingToGoogleSheet } from "@/lib/googlesheets";

export async function POST(request: Request) {
  try {
    const { bookingId, orderId } = await request.json();

    if (!bookingId || !orderId) {
      return NextResponse.json(
        { error: "Booking ID and Order ID are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, room: true, payments: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 1. Idempotency Check: Prevent duplicate confirmation processing
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({
        success: true,
        status: "CONFIRMED",
        bookingReference: booking.referenceId,
        message: "Booking is already confirmed",
      });
    }

    // 2. Server-side payment status verification via Cashfree API
    const { orderStatus, payments } = await fetchCashfreeOrderPayments(orderId);

    const successfulPayment = payments.find((p) => p.payment_status === "SUCCESS");

    // Allow mock fallback if order was initialized in sandbox simulation mode
    const isVerified =
      orderStatus === "PAID" ||
      Boolean(successfulPayment) ||
      (orderId.startsWith("cf_") && process.env.NODE_ENV !== "production");

    if (!isVerified) {
      return NextResponse.json(
        { success: false, error: "Payment verification pending or failed on gateway" },
        { status: 400 }
      );
    }

    const paymentId = successfulPayment?.cf_payment_id || `cf_pay_${Date.now()}`;

    // 3. Database Updates in Transaction
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: {
          bookingId: booking.id,
          cashfreeOrderId: orderId,
        },
        data: {
          cashfreePaymentId: paymentId,
          status: "SUCCESS",
          gatewayResponse: JSON.stringify({ verified: true, orderStatus, payments }),
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

    // 4. Send Email Confirmation (Non-blocking: failures will not reverse confirmed booking)
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
          paymentMethod: "UPI / Cards (Cashfree PG Verified)",
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

        // Audit Log email status
        await prisma.auditLog.create({
          data: {
            userId: null,
            userName: "System (Cashfree Verification)",
            action: "SEND_CONFIRMATION_EMAIL",
            entity: "Booking",
            entityId: booking.id,
            details: isSent
              ? `Confirmation email delivered to ${booking.customer.email}`
              : `Email dispatch logged (Simulation / SMTP response) for ${booking.customer.email}`,
          },
        });
      } catch (mailErr) {
        console.error("Non-blocking confirmation email error:", mailErr);
      }
    }

    // 5. Synchronize Confirmed Booking to Google Sheets (Non-blocking)
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
          userName: "System (Google Sheets Sync)",
          action: "SYNC_GOOGLE_SHEETS",
          entity: "Booking",
          entityId: booking.id,
          details: syncRes.duplicated
            ? `Google Sheets sync skipped (Reference ${booking.referenceId} already exists)`
            : syncRes.success
            ? `Synced ${booking.referenceId} to Google Sheets ('Bookings' tab)`
            : `Google Sheets sync failed/skipped for ${booking.referenceId}`,
        },
      });
    } catch (sheetErr) {
      console.error("Non-blocking Google Sheets sync error:", sheetErr);
    }

    return NextResponse.json({
      success: true,
      status: "CONFIRMED",
      bookingReference: booking.referenceId,
    });
  } catch (error) {
    console.error("Verify Cashfree Payment Error:", error);
    return NextResponse.json(
      { error: "Failed to process payment verification" },
      { status: 500 }
    );
  }
}
