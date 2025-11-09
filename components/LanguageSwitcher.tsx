'use client';

import { useParams } from 'next/navigation'
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

import { useQueryState, parseAsIsoDateTime, parseAsString } from 'nuqs'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LanguageSwitcher() {
  const [city] = useQueryState('city', parseAsString)
  const [datetime] = useQueryState('datetime', parseAsIsoDateTime)
  const [endtime] = useQueryState('endtime', parseAsIsoDateTime)
  const [minPrice] = useQueryState('minPrice', parseAsString)
  const [maxPrice] = useQueryState('maxPrice', parseAsString)

  const urlParams = new URLSearchParams()
  if (city) urlParams.set("city", city);
  if (datetime) urlParams.set("datetime", new Date(datetime).toISOString());
  if (endtime) urlParams.set("endtime", new Date(endtime).toISOString());
  if (minPrice) urlParams.set("minPrice", minPrice);
  if (maxPrice) urlParams.set("maxPrice", maxPrice);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const availableLocales = routing.locales;

  const handleChange = (newLocale: string) => {
    // Replace the current locale segment in the URL
    const segments = pathname.split('/');
    
    if (locale == 'en' || locale == 'EN') {
      segments.splice(1, 0, newLocale.toLocaleLowerCase())
    } else {
      segments[1] = newLocale.toLocaleLowerCase();
    }

    const newUrl = `${segments.join('/')}?${urlParams.toString()}`
    
    router.push(newUrl);
  };

  

  return (
    <Select
        value={locale}
        onValueChange={(e) => handleChange(e)}
    >
        <SelectTrigger className='text-primary'>
            <SelectValue placeholder={ locale } />
            {locale.toUpperCase()}
        </SelectTrigger>
        <SelectContent className="border-0">
            {availableLocales.map((loc) => (
                <SelectItem key={loc} value={loc.toUpperCase()}>
                    {loc.toUpperCase()}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
  );
}
