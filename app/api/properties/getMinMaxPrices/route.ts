import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { 
    inArray,
    min,
    max
 } from 'drizzle-orm';
 
export async function POST(request: NextRequest) {
    const data = await request.json();

    // Parse param into an array of numbers (or strings depending on your schema)
    const propertyIds: number[] = Object.values(data);

    console.log(propertyIds)

    // Get MIN / MAX price for the given property ids
    const rows = await db
        .select({
            minPrice: min(property.pricePerNight),
            maxPrice: max(property.pricePerNight),
        })
        .from(property)
        .where(inArray(property.id, propertyIds));

    return NextResponse.json(rows.length ? rows : null);
}