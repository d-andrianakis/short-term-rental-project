'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useMemo } from 'react';

type Location = {
  lat: number;
  lng: number;
  name?: string;
};

interface GoogleMapProps {
  locations: Location[];
}

export default function GoogleMapComponent({ locations }: GoogleMapProps) {
  // Default map center (you can also compute dynamically)
  const center = useMemo(() => locations[0] ?? { lat: 37.7749, lng: -122.4194 }, [locations]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
      <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
        <Map
          zoom={10}
          center={center}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {locations.map((loc, i) => (
            <Marker
              key={i}
              position={{ lat: loc.lat, lng: loc.lng }}
              title={loc.name ?? `Location ${i + 1}`}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}