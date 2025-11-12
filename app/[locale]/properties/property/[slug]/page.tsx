import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { property } from "@/db/schema";

import React, { Suspense } from "react";
import PropertyData from "@/components/properties/property/PropertyData";
import Loading from "./loading";

import { Metadata } from 'next';

import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from "next/navigation";


export async function generateMetadata(
  { params }: { params: { locale:string, slug: string } }
): Promise<Metadata> {
  const awaitedParams = await params;
  const slugParam = awaitedParams.slug;
  const locale = awaitedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    return notFound();
  }

  const propertyData = await db.select().from(property).where(eq(property.slug, slugParam));

  return {
    title: propertyData[0].name, // Dynamic title
    description: propertyData[0].name, // Optional meta description
    openGraph: {
      title: propertyData[0].name,
      description: propertyData[0].name,
    },
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <Loading />
      }
    >
      <PropertyData slug={slug} />
    </Suspense>
  );
}