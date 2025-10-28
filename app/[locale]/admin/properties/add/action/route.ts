import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await db.insert(property).values({
      id: data.id,
      name: data.name,
      slug: data.slug || null,
      status: data.status,
      identifier: data.identifier,
      value: data.value,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add property" }, { status: 500 });
  }
}
