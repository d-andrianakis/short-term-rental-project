"use server";
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import Link from 'next/link'

export default async function FeaturedListings() {
    const result = await db.select().from(property);

    if (!result.length) {
        return <div>No properties found.</div>;
    }

    const properties = result.map(property => ({
        ...property,
        createdAt: property.createdAt ? property.createdAt.toISOString() : null,
        updatedAt: property.updatedAt ? property.updatedAt.toISOString() : null,
    }));

    return (
        <div>
            <h2>Featured Listings</h2>
            <ul>
                {properties.map((prop) => (
                    <li key={prop.id}>
                        <Link href={`/${prop.slug}`} >{prop.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}