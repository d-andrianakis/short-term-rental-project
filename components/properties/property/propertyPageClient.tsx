'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";

import { useTranslations } from 'next-intl';

import { usePropertyStore } from "@/store/usePropertyStore";

export default function PropertyPageClient({ property }) {
  const router = useRouter();
  const setPropertyId = usePropertyStore((state) => state.setPropertyId);

  const g = useTranslations("Property");

  const handleClick = () => {
    setPropertyId(property.id);

    router.push('/checkout/checkout');
  };
  
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
