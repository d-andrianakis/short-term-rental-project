'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PropertyPageClient({ property }) {
  return (
    <main className="flex space-x-5">
      <div className="w-3/4">
        <Image
          src={property.mainImage ? '/assets/' + property.mainImage : "/assets/placeholder.png"}
          alt="placeholder"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          className="rounded-xl"
        />
        <div>
          <h1>{property.name}</h1>
          <p>{property.slug}</p>
        </div>
      </div>
      <aside className="w-1/4">
        <div>
          <Button variant="secondary">
            Book now!
          </Button>
        </div>
      </aside>
    </main>
  );
}
