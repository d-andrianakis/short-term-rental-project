'use client'

import { useEffect, useState } from "react";
import { useQueryState } from 'nuqs'

import {useTranslations} from 'next-intl';

import getAvailableProperties from './get-available-properties';

import type { SearchParams } from 'nuqs/server'

import Filters from '@/components/properties/filters';

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
        const items = await getAvailableProperties(params)
        setAvailableProperties(items)
      } catch (error) {
        console.error("Failed to load gallery items:", error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <>
        <div className="flex space-x-5">
          <aside className="w-1/6">
            <Filters
              loading={loading}
              onFilter={loadAvailableProperties}
              properties={availableProperties}
            />
          </aside>
          <div className="w-5/6">
            {loading ? (
            <div>{g('loading') ?? 'Loading...'}</div>
          ) : Array.isArray(availableProperties) && availableProperties.length > 0 ? (
            <div>
              {availableProperties.map((prop: any, idx: number) => (
                <div key={prop.id ?? idx} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <strong>{prop.title ?? prop.name ?? `Property ${idx + 1}`}</strong>
                  {prop.location?.city || prop.city ? (
                    <div>{prop.location?.city ?? prop.city}</div>
                  ) : null}
                  <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>
                    {JSON.stringify(prop, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div>{t('no_properties')}</div>
          )}
          </div>
        </div>
      </>
    )
}