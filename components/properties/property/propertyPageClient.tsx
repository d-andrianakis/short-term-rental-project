'use client';

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useTranslations } from 'next-intl';

export default function PropertyPageClient({ property }) {
  const g = useTranslations("Property");

  const handleClick = () => {
    console.log('clicked');
  }

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
            <Link
              href="/checkout/checkout"
            >
              {g('book_now')}
            </Link>
          </Button>
        </div>
      </aside>
    </main>
  );
}
