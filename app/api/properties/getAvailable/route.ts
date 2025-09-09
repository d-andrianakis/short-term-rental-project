import { type NextRequest } from 'next/server'

import { db } from "@/db/drizzle";
import { bookings, properties } from "@/db/schema";
import { and, lt, gt, notInArray } from 'drizzle-orm';
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  if (city && startTime && endTime)

    if (startTime < endTime) {

      console.log("and here")
      // const conflicting = await db
      //   .select({ propertyId: bookings.propertyId })
      //   .from(bookings)
      //   .where(
      //     and(
      //       lt(bookings.start, startTime),  // booking starts before search ends
      //       gt(bookings.end, endTime)  // booking ends after search starts
      // ));

      // const conflictingIds = conflicting.map(c => c.propertyId);

      // console.log(conflictingIds)

      // const available = await db
      //   .select()
      //   .from(properties)
      //   .where(conflictingIds.length > 0
      //     ? notInArray(properties.id, conflictingIds)
      //     : undefined // if no conflicts, return all
      // );
  }
}