import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmailNotification } from "@/lib/mailer";
import { generateInvoiceHTML } from "@/lib/invoice";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const {
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod = "UPI",
    } = await request.json();

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

    // Verify cryptographic signature if provided
    let isValid = true;
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      isValid = verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature verification failed" },
        { status: 400 }
      );
    }

    // Record Payment in Database
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: razorpayOrderId || `order_mock_${Date.now()}`,
        razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
        razorpaySignature: razorpaySignature || "mock_sig",
        amount: booking.netAmount,
        currency: "INR",
        method: paymentMethod as any,
        status: "SUCCESS",
        gatewayResponse: JSON.stringify({ verified: true, date: new Date() }),
      },
    });

    // Update Booking status to CONFIRMED
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        paidAmount: booking.netAmount,
      },
    });

    // Send confirmation email
    if (booking.customer.email) {
      const invoiceHtml = generateInvoiceHTML({
        bookingReference: booking.referenceId,
        customerName: booking.customer.name,
        customerPhone: booking.customer.phone,
        customerEmail: booking.customer.email,
        roomName: booking.room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guestsCount: booking.guestsCount,
        basePrice: booking.room.basePriceDouble,
        totalAmount: booking.totalAmount,
        taxAmount: booking.taxAmount,
        discountAmount: booking.discountAmount,
        netAmount: booking.netAmount,
        paidAmount: booking.netAmount,
        paymentStatus: "SUCCESS",
        paymentMethod,
        createdAt: new Date(),
      });

      await sendEmailNotification({
        to: booking.customer.email,
        subject: `Booking Confirmed (${booking.referenceId}) - Hotel Rajhans International`,
        html: invoiceHtml,
      });
    }

    return NextResponse.json({
      success: true,
      bookingReference: booking.referenceId,
      paymentId: payment.id,
      status: "CONFIRMED",
    });
  } catch (error) {
    console.error("Verify Razorpay Signature Error:", error);
    return NextResponse.json({ error: "Failed to process payment verification" }, { status: 500 });
  }
}
