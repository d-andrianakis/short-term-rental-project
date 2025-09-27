import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { propery_attributes, properties } from "@/db/schema";
import { eq, and, inArray } from 'drizzle-orm';
 
export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const availablePropertyIdsParam = searchParams.get('availablePropertyIds');

    // Parse param into an array of numbers (or strings depending on your schema)
    let availablePropertyIdsArray: number[] = [];
    if (availablePropertyIdsParam) {
      try {
        const parsed = JSON.parse(availablePropertyIdsParam);
        if (Array.isArray(parsed)) {
          availablePropertyIdsArray = parsed.map((v: any) => Number(v));
        } else {
          // fallback to CSV
          availablePropertyIdsArray = String(availablePropertyIdsParam).split(',').map(v => Number(v));
        }
      } catch {
        // fallback to CSV when not JSON
        availablePropertyIdsArray = String(availablePropertyIdsParam).split(',').map(v => Number(v));
      }
    }

    let query = db
      .select({ propertyId: propery_attributes.propertyId, value: propery_attributes.value, text: propery_attributes.text })
      .from(propery_attributes)
      .where(eq(propery_attributes.filterable, 1));

    if (availablePropertyIdsArray.length > 0) {
      query = query.where(inArray(propery_attributes.propertyId, availablePropertyIdsArray));
    }

    const availableFilters = await query;

    return NextResponse.json(availableFilters.length ? availableFilters : null);
}