import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

// Define the 'data' type or import it from the correct location
type data = {
  property: {
    slug?: string;
    mainImage?: string;
    name?: string;
    pricePerNight?: number;
  };
  properties: {
    city?: string;
  };
};

export default function PropertyCard({ property, idx }: { property: data, idx: string }) {
  return (
    <div key={`property-${idx}`}>
      <Link href={`/properties/property/${property.property?.slug ?? idx}`}>
        <Card className="pt-0 border-gray-200 hover:border-gray-400">
          <CardHeader
          className="relative w-full h-64 rounded-xl overflow-hidden"
          >
            <Image 
              src={property.property.mainImage ? '/assets/' + property.property.mainImage : "/assets/placeholder.png"} 
              alt="placeholder"
              fill={true}
              quality={85}
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </CardHeader>
          <CardContent>
            <h2>{property.property.name ?? `Property ${idx + 1}`}</h2>
            <p><strong>{property.properties.city}</strong></p>
            <p>Price per night: {property.property.pricePerNight}</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
