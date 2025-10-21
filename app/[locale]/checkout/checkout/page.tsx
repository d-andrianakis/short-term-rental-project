"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from 'next-intl';

import CheckoutPage from "@/components/checkout/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { usePropertyStore } from "@/store/usePropertyStore";

import { Skeleton } from "@/components/ui/skeleton";

import Image from "next/image";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const g = useTranslations("Checkout");
  const propertyId = usePropertyStore((state) => state.propertyId);

  const [property, setProperty] = useState<any[]>([]);
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

  const amount = 49.99;
  const nights = 5;

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
                  </div>
                </div>
              ) : (
                <p>No property selected</p>
              )}            
        </div>

        <div className="w-1/2 h-full">
            <Elements
                stripe={stripePromise}
                options={{
                mode: "payment",
                amount: convertToSubcurrency(amount),
                currency: "usd",
                }}
            >
                <CheckoutPage amount={amount} />
            </Elements>
        </div>
      
    </main>
  );
}