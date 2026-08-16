import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceHTML } from "@/lib/invoice";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { referenceId: id }],
      },
      include: {
        customer: true,
        room: true,
        payments: true,
      },
    });

    if (!booking) {
      return new NextResponse("Invoice / Booking not found", { status: 404 });
    }

    const gstinSetting = await prisma.setting.findUnique({
      where: { key: "gstin" },
    });

    const payment = booking.payments[0];

    const html = generateInvoiceHTML({
      bookingReference: booking.referenceId,
      customerName: booking.customer.name,
      customerPhone: booking.customer.phone,
      customerEmail: booking.customer.email,
      customerAddress: booking.customer.address,
      roomName: booking.room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestsCount: booking.guestsCount,
      basePrice: booking.room.basePriceDouble,
      totalAmount: booking.totalAmount,
      taxAmount: booking.taxAmount,
      discountAmount: booking.discountAmount,
      netAmount: booking.netAmount,
      paidAmount: booking.paidAmount,
      paymentStatus: payment?.status || (booking.paidAmount >= booking.netAmount ? "SUCCESS" : "PENDING"),
      paymentMethod: payment?.method || "UPI",
      gstin: gstinSetting?.value || "10AAAAA0000A1Z5",
      createdAt: booking.createdAt,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("GET Invoice Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
