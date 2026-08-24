import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchCashfreeOrderPayments } from "@/lib/cashfree";
import { sendEmailNotification } from "@/lib/mailer";
import { generateConfirmationEmailHTML } from "@/lib/invoice";
import { syncBookingToGoogleSheet } from "@/lib/googlesheets";
import type { Booking, Customer, Payment, Room } from "@prisma/client";

export const revalidate = 0;

type BookingWithDetails = Booking & {
  customer: Customer;
  room: Room;
  payments: Payment[];
};

export async function POST(request: Request) {
  try {
    const { bookingId, orderId } = await request.json().catch(() => ({}));

    if (!bookingId || !orderId) {
      return NextResponse.json(
        { success: false, error: "Booking ID and Order ID are required" },
        { status: 400 }
      );
    }

    let booking: BookingWithDetails | null = null;
    try {
      if (prisma && prisma.booking) {
        booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { customer: true, room: true, payments: true },
        });
      }
    } catch (dbLookupErr) {
      console.warn("Booking lookup notice in verify-payment:", dbLookupErr);
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
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

    const refId = booking.referenceId;

    // 2. Server-side payment status verification via Cashfree API
    const { orderStatus, payments } = await fetchCashfreeOrderPayments(orderId);
    const successfulPayment = payments.find(
      (p) => p.order_id === orderId && p.payment_status === "SUCCESS"
    );

    // Confirm only when Cashfree reports the order/payment as settled.
    const isVerified =
      orderStatus.toUpperCase() === "PAID" ||
      orderStatus.toUpperCase() === "SUCCESS" ||
      Boolean(successfulPayment);

    if (!isVerified) {
      return NextResponse.json({
        success: false,
        status: "PENDING",
        error: "Payment verification pending or cancelled by user.",
        bookingReference: refId,
      }, { status: 200 });
    }

    const paymentId = successfulPayment?.cf_payment_id || `cf_pay_${orderId}`;

    // 3. Database Updates
    try {
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
              cashfreePaymentId: paymentId,
              cashfreeOrderId: orderId,
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
    } catch (dbUpdateErr) {
      console.error("DB update error during payment verification:", dbUpdateErr);
      return NextResponse.json(
        { success: false, error: "Payment verified, but booking confirmation could not be saved." },
        { status: 500 }
      );
    }

    // 4. Send Email Confirmation (Non-blocking)
    if (booking.customer.email) {
      try {
        const emailHtml = generateConfirmationEmailHTML({
          bookingReference: refId,
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

        await sendEmailNotification({
          to: booking.customer.email,
          subject: `Booking Confirmed (${refId}) - Hotel Rajhans International`,
          html: emailHtml,
        });
      } catch (mailErr) {
        console.error("Non-blocking confirmation email error:", mailErr);
      }
    }

    // 5. Synchronize Confirmed Booking to Google Sheets (Non-blocking)
    try {
      await syncBookingToGoogleSheet({
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
      });
    } catch (sheetErr) {
      console.error("Non-blocking Google Sheets sync error:", sheetErr);
    }

    return NextResponse.json({
      success: true,
      status: "CONFIRMED",
      bookingReference: refId,
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Verify Cashfree Payment Exception:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
