'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";

import { useTranslations } from 'next-intl';

import { usePropertyStore } from "@/store/usePropertyStore";
import { useEffect, useState } from "react";

export default function PropertyPageClient({ property }) {
  const router = useRouter();
  const setPropertyId = usePropertyStore((state) => state.setPropertyId);

  const g = useTranslations("Property");

  const [reviewScore, setReviewScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(true);

  const handleClick = () => {
    // handle setting peristent property data with Zustand first and then redirect to checkout
    setPropertyId(property.id);
    
    router.push('/checkout/checkout');
  };

  async function fetchData() {
    try {
      const res = await fetch("/api/properties/getPropertyReviewScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property.id),
      });

      const data = await res.json();

      let score = '';
      if (data) {
        score = data ?? null;
        score = parseFloat(data);
        score = parseFloat(score.toFixed(2));
      }      

      setReviewScore(typeof score === 'number' ? score : null);
    } catch (err) {
      console.error("Failed to fetch review score", err);
      setReviewScore(null);
    } finally {
      setLoadingScore(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <main className="flex space-x-5">
      <div className="w-3/4">
        <Image
          src={property.mainImage ? '/assets/' + property.mainImage : "/assets/placeholder.png"}
          alt="placeholder"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-xl w-full h-auto"
        />
        <div className="mt-3">
          {loadingScore ? (
            <p>Loading review score...</p>
          ) : reviewScore !== null ? (
            <p>{g('rating')} {reviewScore}</p>
          ) : (
            <p>No review score available</p>
          )}
        </div>
        <div>
          <h1>{property.name}</h1>
          <p>{property.slug}</p>
        </div>
      </div>
      <aside className="w-1/4 h-screen relative">
        <div className="sticky top-0">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleClick}
          >
              {g('book_now')}
          </Button>
        </div>
      </aside>
    </main>
  );
}
