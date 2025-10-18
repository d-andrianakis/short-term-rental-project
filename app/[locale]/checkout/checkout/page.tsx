"use client";

import CheckoutPage from "@/components/checkout/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { usePropertyStore } from "@/store/usePropertyStore";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const propertyId = usePropertyStore((state) => state.propertyId);

  console.log(`property id is: ${propertyId}`)

  const amount = 49.99;

  return (
    <main className="flex mx-auto justify-between items-stretch p-10 text-white text-center border m-10 rounded-md">
        <div className="w-1/2 border border-solid border-black rounded-md">
            <h1 className="text-black text-4xl font-extrabold mb-2">Overview</h1>
            <h2 className="text-black text-2xl">
            amount
            <span className="font-bold">${amount}</span>
            <p className="font-bold">Property:</p>
            </h2>
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