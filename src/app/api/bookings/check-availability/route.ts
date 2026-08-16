import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDateOverlap } from "@/lib/utils";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { roomId, roomType, checkIn, checkOut } = await request.json();

    if ((!roomId && !roomType) || !checkIn || !checkOut) {
      return NextResponse.json(
        { available: false, error: "Missing required fields (room/dates)" },
        { status: 400 }
      );
    }

    // Find room by ID or type
    let room;
    if (roomId) {
      room = await prisma.room.findUnique({ where: { id: roomId } });
    } else if (roomType) {
      const typeEnum = roomType.toUpperCase();
      room = await prisma.room.findFirst({
        where: {
          OR: [{ type: typeEnum as any }, { slug: roomType }],
        },
      });
    }

    if (!room) {
      return NextResponse.json(
        { available: false, error: "Room category not found" },
        { status: 444 }
      );
    }

    if (room.status !== "AVAILABLE") {
      return NextResponse.json({
        available: false,
        reason: `Room is currently in ${room.status.toLowerCase()} mode.`,
      });
    }

    // Check existing confirmed/checked-in bookings for date overlap
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const existingBookings = await prisma.booking.findMany({
      where: {
        roomId: room.id,
        status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
      },
    });

    const isOverlap = existingBookings.some((b) =>
      isDateOverlap(checkInDate, checkOutDate, b.checkIn, b.checkOut)
    );

    if (isOverlap) {
      return NextResponse.json({
        available: false,
        reason: "Selected room is already booked for these dates.",
      });
    }

    // Check maintenance / blocked dates
    const blockedDates = await prisma.availability.findMany({
      where: {
        roomId: room.id,
        status: { in: ["MAINTENANCE", "BLOCKED"] },
      },
    });

    const hasBlockedDate = blockedDates.some((b) => {
      const bDate = new Date(b.date);
      return bDate >= checkInDate && bDate < checkOutDate;
    });

    if (hasBlockedDate) {
      return NextResponse.json({
        available: false,
        reason: "Selected room is undergoing maintenance on these dates.",
      });
    }

    return NextResponse.json({
      available: true,
      room: {
        id: room.id,
        name: room.name,
        type: room.type,
        basePriceSingle: room.basePriceSingle,
        basePriceDouble: room.basePriceDouble,
        taxPercentage: room.taxPercentage,
      },
    });
  } catch (error) {
    console.error("Check Availability Error:", error);
    return NextResponse.json(
      { available: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
