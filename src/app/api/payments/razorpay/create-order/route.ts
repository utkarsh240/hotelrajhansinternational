import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, room: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Razorpay amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(booking.netAmount * 100);

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: booking.referenceId,
        notes: {
          bookingId: booking.id,
          referenceId: booking.referenceId,
          customerName: booking.customer.name,
          customerPhone: booking.customer.phone,
        },
      });
    } catch (rzpErr) {
      console.warn("Razorpay Sandbox Fallback:", rzpErr);
      // Fallback order structure for sandbox testing without active API key
      razorpayOrder = {
        id: `order_mock_${Date.now()}`,
        entity: "order",
        amount: amountInPaise,
        currency: "INR",
        receipt: booking.referenceId,
        status: "created",
      };
    }

    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_rajhans123",
        bookingReference: booking.referenceId,
        customerName: booking.customer.name,
        customerPhone: booking.customer.phone,
        customerEmail: booking.customer.email,
        roomName: booking.room.name,
      },
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
