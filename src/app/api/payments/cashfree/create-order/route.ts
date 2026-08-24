import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCashfreeOrder, getCashfreeEnvironment } from "@/lib/cashfree";
import type { Booking, Customer, Room } from "@prisma/client";

export const revalidate = 0;

type BookingWithDetails = Booking & {
  customer: Customer;
  room: Room;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
    }

    let booking: BookingWithDetails | null = null;
    try {
      if (prisma && prisma.booking) {
        booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { customer: true, room: true },
        });
      }
    } catch (dbErr) {
      console.warn("Database lookup warning in create-order:", dbErr);
      return NextResponse.json(
        { success: false, error: "Unable to load booking for payment." },
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Generate unique Cashfree order ID based on booking reference
    const orderId = `cf_${booking.referenceId.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}`;

    // Create Cashfree Order
    const cashfreeOrder = await createCashfreeOrder({
      orderId,
      amount: booking.netAmount,
      currency: "INR",
      customerId: booking.customer.id,
      customerName: booking.customer.name,
      customerPhone: booking.customer.phone,
      customerEmail: booking.customer.email || "guest@hotelrajhansinternational.com",
      orderNote: `Hotel Rajhans Reservation ${booking.referenceId}`,
    });

    // Store Payment record in Database with status PENDING (safely wrapped)
    try {
      if (prisma && prisma.payment) {
        await prisma.payment.create({
          data: {
            bookingId: booking.id,
            cashfreeOrderId: cashfreeOrder.order_id,
            amount: booking.netAmount,
            currency: "INR",
            method: "UPI",
            status: "PENDING",
            gatewayResponse: JSON.stringify(cashfreeOrder),
          },
        });
      }
    } catch (payDbErr) {
      console.warn("Payment record DB logging warning:", payDbErr);
    }

    return NextResponse.json({
      success: true,
      paymentSessionId: cashfreeOrder.payment_session_id,
      orderId: cashfreeOrder.order_id,
      bookingReference: booking.referenceId,
      environment: getCashfreeEnvironment(),
    });
  } catch (error: unknown) {
    console.error("Create Cashfree Order Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize payment session",
      },
      { status: 400 }
    );
  }
}
