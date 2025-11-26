'use client'

import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react";
import { useQueryState } from 'nuqs';

import {useTranslations} from 'next-intl';

import getAvailableProperties from './get-available-properties';

import Filters from '@/components/properties/filters';
import Loading from "./loading";
import PropertyCard from "@/components/properties/PropertyCard";

import GoogleMapComponent from '@/components/maps/Map';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function SearchBar() {
    const isMobile = useIsMobile()

    const g = useTranslations("Global");
    const t = useTranslations("Properties");

    const [availableProperties, setAvailableProperties] = useState([]);
    const [loading, setLoading] = useState(false)

    // read current query params on the client so values are always up-to-date
    const [city] = useQueryState("city", { defaultValue: "" });
    const [datetime] = useQueryState("datetime", { defaultValue: "" });
    const [endtime] = useQueryState("endtime", { defaultValue: "" });
    const [minPrice] = useQueryState("minPrice", { defaultValue: undefined });
    const [maxPrice] = useQueryState("maxPrice", { defaultValue: undefined });

    useEffect(() => {
      loadAvailableProperties()
    }, [city, datetime, endtime, minPrice, maxPrice]) // reload when any query param changes
  
    const loadAvailableProperties = async (filter?: string) => {
  try {
    setLoading(true)
    // Convert string values to numbers, handling undefined cases
    const params = { 
      city, 
      datetime, 
      endtime, 
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    }
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
      <div className={`flex space-x-5 ${isMobile ? 'flex-col' : null}`}>
        { !isMobile &&
        <aside className="w-1/4 xl:w-1/6">
          <Filters
            loading={loading}
            onFilter={loadAvailableProperties}
            properties={availableProperties}
          />
        </aside> }

        <div className={ isMobile ? "w-full" : "w-3/4 xl:w-5/6" }>
        { isMobile ?
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" >
                  {t('map_view')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full">
                <GoogleMapComponent locations={locations} />
              </PopoverContent>
            </Popover>
            <Sheet>
              <SheetTrigger asChild>
                <Button>{ g('filters') }</Button>
              </SheetTrigger>
              <SheetContent className="w-[90vw] border-r-0">
                <SheetHeader>
                  <SheetTitle>
                    { g('filters') }
                  </SheetTitle>
                </SheetHeader>
                <aside className="w-full px-4">
                  <Filters
                    loading={loading}
                    onFilter={loadAvailableProperties}
                    properties={availableProperties}
                  />
                  
                </aside>
              </SheetContent>
            </Sheet>
          </div>
        :
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
        }
        
          {loading ? (
          <Loading />
        ) : Array.isArray(availableProperties) && availableProperties.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 my-5 md:grid-cols-2 xl:grid-cols-3">
            {availableProperties.map((prop, idx: number) => (
              <PropertyCard 
                property={prop} 
                idx={Math.random().toString(36).slice(2)} 
                key={`property-${idx}`}
              />
            ))}
          </div>
        ) : (
          <div>{t('no_properties')}</div>
        )}
        </div>
      </div>
    )
}