"use server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

import { property } from "@/db/schema";

export async function removeProperty(propertyId: string) {
  try {
    await db.delete(property).where(eq(property.id, propertyId));
    return { success: true };
  } catch (error) {
    console.error("Failed to remove property:", error);
    return { success: false, error: error.message };
  }
}