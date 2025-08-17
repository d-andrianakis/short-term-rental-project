import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
    
    const { slug } = await context.params;
    const propertyData = await db.select().from(property).where(eq(property.slug, slug));
    return NextResponse.json(propertyData.length ? propertyData[0] : null);
}
