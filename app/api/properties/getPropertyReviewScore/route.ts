import { type NextRequest, NextResponse } from 'next/server'

import { db } from "@/db/drizzle";
import { property_reviews } from "@/db/schema";
import { avg, eq } from 'drizzle-orm';
 
export async function POST(request: NextRequest) {

    const data = await request.json();

    const propertyId = Number(data);

    if (Number.isFinite(propertyId)) {
        const query = db.select({ numeric: avg(property_reviews.overallScore) })
        .from(property_reviews)
        .where(
            eq(property_reviews.propertyId, propertyId)
        );

        const reviewScore = await query;

        return NextResponse.json(reviewScore.length ? reviewScore[0].numeric : null);
    }
    

    return NextResponse.json(null);
}