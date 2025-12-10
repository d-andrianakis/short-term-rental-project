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
  const [visibleLocations, setVisibleLocations] = useState<Location[]>([]);

  const center = useMemo(() => locations[0] ?? { lat: 37.7749, lng: -122.4194 }, [locations]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 21)); // 21 is Google Maps max zoom
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 0));
  };

  return (
    <APIProvider apiKey=''>
      <div className='flex'>
        <aside style={{ width: 300, padding: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Visible pins: {visibleLocations.length}</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {visibleLocations.map((loc, i) => (
              <li key={i}>
                {loc.name ?? `Pin ${i + 1}`} ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
              </li>
            ))}
          </ul>
        </aside>
        <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: 20 }}>
          <Map
            center={center}
            zoom={zoomLevel} // <-- control zoom on the Map
            onZoomChanged={(event) => {
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
            <GetMapData locations={locations} onVisibleChange={setVisibleLocations} watchZoom={zoomLevel} />

            {locations.map((loc, i) => (
              <Marker
                key={i}
                position={{ lat: loc.lat, lng: loc.lng }}
                title={loc.name ?? `Location ${i + 1}`}
              />
            ))}
          </Map>
        </div>
      </div>     
    </APIProvider>
  );
}

export function GetMapData ({
  locations,
  onVisibleChange,
  watchZoom
}: {
  locations: Location[];
  onVisibleChange: (visible: Location[]) => void;
  watchZoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const emitBounds = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      const ne = bounds.getNorthEast().toJSON();
      const sw = bounds.getSouthWest().toJSON();
      const center = map.getCenter()?.toJSON();
      // compute visible locations
      const visible = locations.filter((loc) => {
        try {
          // bounds.contains accepts LatLngLiteral
          return bounds.contains({ lat: loc.lat, lng: loc.lng });
        } catch {
          return false;
        }
      });
      onVisibleChange(visible);
      console.log('map bounds:', { ne, sw, center, visibleCount: visible.length });
    };

    // initial read
    emitBounds();

    // use 'bounds_changed' for continuous updates, or 'idle' for stable bounds after interactions
    const listener = map.addListener('bounds_changed', emitBounds);

    return () => listener.remove();
  // re-run if map or locations change
  }, [map, locations, onVisibleChange]);

  // also run when parent-controlled zoom changes (ensures update when programmatically changing zoom)
  useEffect(() => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    const visible = locations.filter((loc) => {
      try {
        return bounds.contains({ lat: loc.lat, lng: loc.lng });
      } catch {
        return false;
      }
    });
    onVisibleChange(visible);
  }, [watchZoom, map, locations, onVisibleChange]);

  return null;
}