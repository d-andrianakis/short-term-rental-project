"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from 'next-intl';

import CheckoutPage from "@/components/checkout/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { usePropertyStore } from "@/store/usePropertyStore";

import { Skeleton } from "@/components/ui/skeleton";

import { CalendarCheck2 } from 'lucide-react';
import { CalendarX2 } from 'lucide-react';

import Image from "next/image";
import { useRouter } from "next/navigation";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const g = useTranslations("Checkout");
  const router = useRouter();

  const propertyId = usePropertyStore((state) => state.propertyId);
  const fromDate = usePropertyStore((state) => state.fromDate);
  const toDate = usePropertyStore((state) => state.toDate);

  const [property, setProperty] = useState<any | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  
  async function fetchData() {
    if (propertyId) {
      const res = await fetch(`/api/properties/getPropertyById/${propertyId}`, { method: "GET" });
      const data = await res.json();
      setProperty(data);
      setLoadingProperty(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  function daysBetweenIso(startIso?: string | null, endIso?: string | null) {
    if (!startIso || !endIso) return 0;
    const s = new Date(startIso);
    const e = new Date(endIso);
    const utcStart = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
    const utcEnd = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((utcEnd - utcStart) / msPerDay);
  }

  const nights = daysBetweenIso(fromDate, toDate);
  const total = nights * (property?.pricePerNight ?? 0);
  
  return (
    <main className="flex mx-auto justify-between items-stretch p-10 text-white text-center border m-10 rounded-md">
        <div className="w-1/2 border border-solid border-black rounded-md p-5">
            <h1 className="text-black text-3xl font-extrabold mb-2">{g('summary')}</h1>
            <p className="font-bold">Property:</p>
            {loadingProperty ? (
                <div className="w-1/2 mx-auto py-5">
                  <Skeleton className="h-8" />
                </div>
              ) : property !== null ? (
                <div className="flex">
                  <div className="w-1/3">
                    <Image
                      src={property.mainImage ? '/assets/' + property.mainImage : "/assets/placeholder.png"}
                      alt="placeholder"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                  <div className="w-2/3 pl-5 text-left text-foreground">
                    <p className="text-foreground">{property.name}</p>
                    <p className="">{property.pricePerNight}</p>
                    <div className="flex space-x-5">
                      <span>{fromDate ?? 'No from date selected'}</span>
                      <CalendarCheck2 />
                    </div>
                    <div className="flex space-x-5">
                      <p>{toDate ?? 'No to date selected'}</p>
                      <CalendarX2 />
                    </div>
                    <div className="checkout-summary flex space-x-5 mt-5 border-t border-black">
                      <p>{g('total')}</p>
                      <p>{total}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No property selected</p>
              )}            
        </div>

        <div className="w-1/2 h-full">
        {total ? (
            <Elements
                stripe={stripePromise}
                options={{
                mode: "payment",
                amount: convertToSubcurrency(total),
                currency: "usd",
                }}
            >
                <CheckoutPage amount={total} />
            </Elements>
                ) : (
                <p>Loading</p>
              )}
      </div>
    </main>
  );
}