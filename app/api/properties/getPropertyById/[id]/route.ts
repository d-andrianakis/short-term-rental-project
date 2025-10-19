import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const propertyData = await db.select().from(property).where(eq(property.id, id));
    return NextResponse.json(propertyData.length ? propertyData[0] : null);
}
