'use client';

export default function PropertyPageClient({ property }) {
  return (
    <div>
      <h1>{property.name}</h1>
      <p>{property.slug}</p>
    </div>
  );
}
