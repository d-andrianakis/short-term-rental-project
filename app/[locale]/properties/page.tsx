'use client'

import { useEffect, useState } from "react";
import { useQueryState } from 'nuqs'

import {useTranslations} from 'next-intl';

import getAvailableProperties from './get-available-properties';

import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function SearchBar({ searchParams }: PageProps) {
    const g = useTranslations("Global");
    const t = useTranslations("Properties");

    const [availableProperties, setAvailableProperties] = useState<string | null>(null);

    const [loading, setLoading] = useState(false)

    // const city = searchParams.get('city')
    // const datetime = searchParams.get('datetime')

    useEffect(() => {
      loadAvailableProperties()
    }, [])
  
    const loadAvailableProperties = async () => {
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
        {loading ? (
          <div>{g('loading') ?? 'Loading...'}</div>
        ) : availableProperties ? (
          <div>{availableProperties}</div>
        ) : (
          <div>{t('no_properties')}</div>
        )}
      </>
    )
}