// components/properties/property/PropertyData.tsx
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { property } from "@/db/schema";
import { notFound } from "next/navigation";
import PropertyPageClient from "@/components/properties/property/propertyPageClient";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function PropertyData({ slug }: { slug: string }) {

  await wait(2000);

  const result = await db.select().from(property).where(eq(property.slug, slug));

  if (!result.length) {
    notFound();
  }

  return <PropertyPageClient property={result[0]} />;
}
