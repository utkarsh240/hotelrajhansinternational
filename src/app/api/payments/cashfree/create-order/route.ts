import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCashfreeOrder, getCashfreeEnvironment } from "@/lib/cashfree";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { bookingId } = body;

    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json(
        { success: false, error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, room: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    // Generate unique Cashfree order ID
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

    // Save Payment record in Database (PENDING)
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

    return NextResponse.json({
      success: true,
      paymentSessionId: cashfreeOrder.payment_session_id,
      orderId: cashfreeOrder.order_id,
      bookingReference: booking.referenceId,
      environment: getCashfreeEnvironment(),
    });
  } catch (error: unknown) {
    console.error("Create Cashfree Order Route Exception:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to initialize payment session";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
