import { db } from "@/db/drizzle";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const sliders = await db.select().from(settings).where(eq(settings.key, "hero_slider"));

    return NextResponse.json(sliders.length ? sliders : null);
}
