import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { bookings, properties } from "@/db/schema";
import { and, lt, gt, notInArray } from 'drizzle-orm';
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  function toTimestamp(datetimeStr: string): number {
    return new Date(datetimeStr).getTime();
  }

  if (city && startTime && endTime) {

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const startDateTimestamp = toTimestamp(startDate);
    const endDateTimestamp = toTimestamp(endDate);

    console.log("first check")

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new Response('Invalid date format for startTime or endTime', { status: 400 });
    }

    console.log(startDateTimestamp)
    console.log(endDateTimestamp)
    if (startDateTimestamp >= endDateTimestamp) {
      return new Response('startTime must be before endTime', { status: 400 });
    }

    // overlap when booking.start < searchEnd AND booking.end > searchStart
    const conflicting = await db
      .select({ propertyId: bookings.propertyId })
      .from(bookings)
      .where(
        and(
          lt(bookings.start, endDate),   // booking starts before search ends
          gt(bookings.end, startDate)    // booking ends after search starts
        )
    );

    const conflictingIds = conflicting.map(c => c.propertyId);

    const available = await db
      .select()
      .from(properties)
      .where(conflictingIds.length > 0
        ? notInArray(properties.id, conflictingIds)
        : undefined // if no conflicts, return all
    );

    return NextResponse.json(available.length ? available : null);
  }
}