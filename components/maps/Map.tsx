'use client';

import {
  Marker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useMap
} from '@vis.gl/react-google-maps';

import { useMemo, useState, useEffect } from 'react';
import { Button } from '../ui/button';

type Location = {
  lat: number;
  lng: number;
  name?: string;
};

interface GoogleMapProps {
  locations: Location[];
}

export default function GoogleMapComponent({ locations }: GoogleMapProps) {
  const [zoomLevel, setZoomLevel] = useState(10);

  const center = useMemo(() => locations[0] ?? { lat: 37.7749, lng: -122.4194 }, [locations]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 21)); // 21 is Google Maps max zoom
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 0));
  };

  

  return (
    <APIProvider apiKey=''>
      <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: 20 }}>
        <Map
          center={center}
          zoom={zoomLevel} // <-- control zoom on the Map
          onZoomChanged={(event: any) => {
            // keep local state in sync when the user zooms via map controls/scroll
            const newZoom = event?.detail?.zoom;
            if (typeof newZoom === 'number') setZoomLevel(newZoom);
          }}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <MapControl position={ControlPosition.TOP_RIGHT}>
            <div style={{background: 'white', color: 'black', padding:8}}>
              <Button variant="outline" onClick={handleZoomIn}>+</Button>
              <Button variant="outline" onClick={handleZoomOut}>-</Button>
            </div>
          </MapControl>

          {/* Inject the hook-using component so it runs inside Map context */}
          <GetMapData />

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

export function GetMapData () {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const emitBounds = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      const ne = bounds.getNorthEast().toJSON();
      const sw = bounds.getSouthWest().toJSON();
      const center = map.getCenter()?.toJSON();
      console.log('map bounds:', { ne, sw, center });
      // you can set state or call a callback here instead of console.log
    };

    // initial read
    emitBounds();

    // use 'bounds_changed' for continuous updates, or 'idle' for stable bounds after interactions
    const listener = map.addListener('bounds_changed', emitBounds);

    return () => listener.remove();
  }, [map]);

  return null;
}