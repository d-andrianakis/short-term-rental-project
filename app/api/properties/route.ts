// app/api/properties/route.ts
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await db.select().from(property);
  return NextResponse.json(response);
}
