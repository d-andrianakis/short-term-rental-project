import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { property } from "@/db/schema";

import React, { Suspense } from "react";
import PropertyData from "@/components/properties/property/PropertyData";
import Loading from "./loading";

import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from "next/navigation";

interface PropertyPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata(
  { params }: PropertyPageProps
) {
  const { locale, slug } = params;

  if (!hasLocale(routing.locales, locale)) {
    return notFound();
  }

  const propertyData = await db
    .select()
    .from(property)
    .where(eq(property.slug, slug));

  if (!propertyData || propertyData.length === 0) {
    return notFound();
  }

  return {
    title: propertyData[0].name,
    description: propertyData[0].name,
    openGraph: {
      title: propertyData[0].name,
      description: propertyData[0].name,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = params;

  return (
    <Suspense fallback={<Loading />}>
      <PropertyData slug={slug} />
    </Suspense>
  );
}

