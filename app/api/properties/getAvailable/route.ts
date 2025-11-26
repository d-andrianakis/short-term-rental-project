import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { bookings, properties, property, propery_attributes } from "@/db/schema";
import { eq, and, lt, gt, gte, lte, notInArray } from 'drizzle-orm';
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const filterBy = searchParams.get('filterBy') ?? null;
  const minPrice = searchParams.get('minPrice') ?? null;
  const maxPrice = searchParams.get('maxPrice') ?? null;
  const whereConditions = [];

  function toTimestamp(datetime: string | Date): number {
    return new Date(datetime).getTime();
  }

  if (city && startTime && endTime) {

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const startDateTimestamp = toTimestamp(startDate);
    const endDateTimestamp = toTimestamp(endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new Response('Invalid date format for startTime or endTime', { status: 400 });
    }

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

    const conflictingIds = conflicting.map(c => String(c.propertyId));

    if (minPrice && minPrice !== undefined) {
      whereConditions.push(gte(property.pricePerNight, minPrice));
    }
    if (maxPrice && maxPrice !== undefined) {
      whereConditions.push(lte(property.pricePerNight, maxPrice));
    }

    let query;
    if (filterBy) {
      // ensure the filter value is a string so the DB param will be text (avoids text = integer)
      const filterValue = String(filterBy);

      if (conflictingIds.length > 0) {
        whereConditions.push(notInArray(properties.id, conflictingIds));
      }
      // match attribute value as text
      whereConditions.push(eq(propery_attributes.value, filterValue));

      query = db
        .select({properties, property})
        .from(properties)
        .leftJoin(property, eq(properties.id, property.id))
        .leftJoin(propery_attributes, eq(properties.id, propery_attributes.propertyId))
        .where(whereConditions.length ? and(...whereConditions) : undefined);
    } else {
      query = db
        .select({properties, property})
        .from(properties)
        .leftJoin(property, eq(properties.id, property.id))
        .where(whereConditions.length ? and(...whereConditions) : undefined);
    }

    const available = await query;

    return NextResponse.json(available.length ? available : null);
  }
}