// app/api/properties/[id]/route.ts
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await db.delete(property).where(eq(property.id, Number(id)));
    return NextResponse.json({ success: true });
}
