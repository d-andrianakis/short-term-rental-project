
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function PropertyCard({ property, idx }: { property: any, idx: string }) {
  return (
    <div key={idx} className="border border-solid border-white rounded-xl p-2">
        <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <Image 
                src={property.property.mainImage ? '/assets/' + property.property.mainImage : "/assets/placeholder.png"} 
                alt="placeholder"
                fill={true}
                quality={85}
                style={{ objectFit: "cover" }}
                loading="lazy"
            />
        </div>
      <strong>{property.property.name ?? `Property ${idx + 1}`}</strong>
      <p><strong>{property.properties.city}</strong></p>
      {console.log(property)}
      <div>
        <Button asChild>
          <Link href={`/properties/property/${property.property?.slug ?? idx}`}>
            View details
          </Link>
        </Button>
      </div>
    </div>
  );
}
