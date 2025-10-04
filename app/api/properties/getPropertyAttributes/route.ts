import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { propery_attributes, properties } from "@/db/schema";
import { eq, and, inArray } from 'drizzle-orm';
 
export async function POST(request: NextRequest) {

    const data = await request.json();

    // const searchParams = request.nextUrl.searchParams;
    // const availablePropertyIdsParam = searchParams.get('availablePropertyIds');

    console.log(`ids: ${data}`)
    console.log(`ids: ${typeof data}`)

    // Parse param into an array of numbers (or strings depending on your schema)
    const availablePropertyIdsArray: number[] = Object.values(data);

    console.log("avaiable property ids array " + availablePropertyIdsArray);

    // if (availablePropertyIdsParam) {
    //   try {
    //     const parsed = JSON.parse(availablePropertyIdsParam);
    //     if (Array.isArray(parsed)) {
    //       availablePropertyIdsArray = parsed.map((v: any) => Number(v));
    //     } else {
    //       // fallback to CSV
    //       availablePropertyIdsArray = String(availablePropertyIdsParam).split(',').map(v => Number(v));
    //     }
    //   } catch {
    //     // fallback to CSV when not JSON
    //     availablePropertyIdsArray = String(availablePropertyIdsParam).split(',').map(v => Number(v));
    //   }
    // }

    let query = db
      .select({ propertyId: propery_attributes.propertyId, value: propery_attributes.value, text: propery_attributes.text })
      .from(propery_attributes)
      .where(eq(propery_attributes.filterable, 1));

    if (availablePropertyIdsArray.length > 0) {
      query = query.where(inArray(propery_attributes.propertyId, availablePropertyIdsArray));
    }

    const availableFilters = await query;

    console.log(availableFilters);

    // return NextResponse.json(availableFilters.length ? availableFilters : null);
    return NextResponse.json(null);
}