'use client';

import Image from "next/image";
import { SearchFormProperty } from "@/components/ui/search-form property";

import { useTranslations } from 'next-intl';

// import { usePropertyStore } from "@/store/usePropertyStore";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/is-mobile";

export default function PropertyPageClient({ property }) {
  // const router = useRouter();
  // const setPropertyId = usePropertyStore((state) => state.setPropertyId);

  const isMobile = useIsMobile()
  const g = useTranslations("Property");

  const [reviewScore, setReviewScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(true);

  async function fetchData() {
    try {
      const res = await fetch("/api/properties/getPropertyReviewScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property.id),
      });

      const data = await res.json();

      let score: number | null = null;
      if (data) {
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
    <main className={`flex space-x-5 ${isMobile ? "flex-col space-y-4" : ""}`}>
      <div className={ isMobile ? "w-full" : "w-3/4"}>
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
      <aside className={`h-screen relative ${isMobile ? "w-full" : "w-1/4"}`}>
        <div className="sticky top-0">
          <SearchFormProperty 
            propertyId = {property.id}
          />
        </div>
      </aside>
    </main>
  );
}
