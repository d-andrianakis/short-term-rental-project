import { type NextRequest, NextResponse } from 'next/server'
import { db } from "@/db/drizzle";
import { propery_attributes } from "@/db/schema";
import { eq, inArray, and } from 'drizzle-orm';
 
export async function POST(request: NextRequest) {
    const data = await request.json();
    // Parse param into an array of numbers (or strings depending on your schema)
    const availablePropertyIdsArray: number[] = Object.values(data);
    
    // Build conditions array
    const conditions = [eq(propery_attributes.filterable, true)];
    
    if (availablePropertyIdsArray.length > 0) {
      conditions.push(inArray(propery_attributes.propertyId, availablePropertyIdsArray));
    }
    
    const availableFilters = await db
      .select({ 
        propertyId: propery_attributes.propertyId, 
        value: propery_attributes.value, 
        text: propery_attributes.text, 
        filterType: propery_attributes.filterType 
      })
      .from(propery_attributes)
      .where(and(...conditions));
    
    return NextResponse.json(availableFilters.length ? availableFilters : null);
}