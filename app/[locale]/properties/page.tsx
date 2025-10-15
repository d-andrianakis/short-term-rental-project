'use client'

import { useEffect, useState } from "react";
import { useQueryState } from 'nuqs'

import {useTranslations} from 'next-intl';

import getAvailableProperties from './get-available-properties';

import type { SearchParams } from 'nuqs/server'

import Filters from '@/components/properties/filters';
import Loading from "./loading";

import GoogleMapComponent from '@/components/maps/Map';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function SearchBar({ searchParams }: PageProps) {
    const g = useTranslations("Global");
    const t = useTranslations("Properties");

    // const [availableProperties, setAvailableProperties] = useState<string | null>(null);
    const [availableProperties, setAvailableProperties] = useState<any[] | null>(null);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
      loadAvailableProperties()
    }, [])
  
    const loadAvailableProperties = async (filter?: string) => {
      try {
        setLoading(true)
        const params = await searchParams
        const items = await getAvailableProperties(params, filter)
        setAvailableProperties(items)
      } catch (error) {
        console.error("Failed to load gallery items:", error)
      } finally {
        setLoading(false)
      }
    }

    const locations = [
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
      { lat: 37.8044, lng: -122.2711, name: 'Oakland' },
      { lat: 37.6879, lng: -122.4702, name: 'Daly City' },
    ];

    return (
      <div className="flex space-x-5">
        <aside className="w-1/6">
          <Filters
            loading={loading}
            onFilter={loadAvailableProperties}
            properties={availableProperties}
          />
        </aside>
        <div className="w-5/6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">
              Open map view
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-7xl">
            <GoogleMapComponent locations={locations} />
          </PopoverContent>
        </Popover>
          {loading ? (
          <Loading />
        ) : Array.isArray(availableProperties) && availableProperties.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {availableProperties.map((prop: any, idx: number) => (
              <div key={prop.id ?? idx} className="" style={{ padding: '8px 0' }}>
                <strong>{prop.title ?? prop.name ?? `Property ${idx + 1}`}</strong>
                {prop.location?.city || prop.city ? (
                  <div>{prop.location?.city ?? prop.city}</div>
                ) : null}
                <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>
                  {JSON.stringify(prop, null, 2)}
                </pre>
                <div>
                  <Button asChild>
                    <Link href={`/properties/property/${prop.property.slug ?? idx}`}>
                      View details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>{t('no_properties')}</div>
        )}
        </div>
      </div>
    )
}