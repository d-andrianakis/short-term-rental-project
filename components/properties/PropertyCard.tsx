import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PropertyCard({ property, idx }: { property: any, idx: string }) {
  return (
    <div key={`property-${idx}`}>
      <Link href={`/properties/property/${property.property?.slug ?? idx}`}>
        <Card className="pt-0 border-gray-200 hover:border-black">
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
