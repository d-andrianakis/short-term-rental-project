'use client';

import {
  Marker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useMap
} from '@vis.gl/react-google-maps';

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

  const map = useMap();

  console.log(map?.getBounds());

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
      <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: 20 }}>
        <Map
          zoom={10}
          center={center}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <MapControl position={ControlPosition.TOP_RIGHT}>
            <div style={{background: 'white', color: 'black', padding:8}}>
              .. any component here will be added to the control-containers of the
          google map instance ..
            </div>
          </MapControl>
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