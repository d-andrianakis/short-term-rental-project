"use server";

import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function removePropertyAction(id: number) {
  await db.delete(property).where(eq(property.id, id));
}
