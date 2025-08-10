"use server"

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

import { property } from "@/db/schema";
import Link from 'next/link';

import { notFound } from 'next/navigation';

import PropertyPageClient from "@/components/properties/property/propertyPageClient";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const result = await db.select().from(property).where(eq(property.slug, slug));

    if (!result.length) {
        notFound();
    }

    const propertyData = JSON.stringify(result);
    const parsedData = JSON.parse(propertyData);

    return (
       <PropertyPageClient property={parsedData[0]} />
    );
}