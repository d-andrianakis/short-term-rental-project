import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { propery_attributes } from "@/db/schema";
import { eq, inArray } from 'drizzle-orm';
 
export async function POST(request: NextRequest) {

    const data = await request.json();

    // Parse param into an array of numbers (or strings depending on your schema)
    const availablePropertyIdsArray: number[] = Object.values(data);

    let query = db
      .select({ propertyId: propery_attributes.propertyId, value: propery_attributes.value, text: propery_attributes.text, filterType : propery_attributes.filterType })
      .from(propery_attributes)
      .where(eq(propery_attributes.filterable, 1));

    if (availablePropertyIdsArray.length > 0) {
      query = query.where(inArray(propery_attributes.propertyId, availablePropertyIdsArray));
    }

    const availableFilters = await query;

    return NextResponse.json(availableFilters.length ? availableFilters : null);
}