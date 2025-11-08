'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const availableLocales = routing.locales;

  const handleChange = (newLocale: string) => {
    // Replace the current locale segment in the URL
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <Select
        value={locale}
        onValueChange={(e) => handleChange(e)}
    >
        <SelectTrigger>
            <SelectValue placeholder={ locale } />
            {locale.toUpperCase()}
        </SelectTrigger>
        <SelectContent>
            {availableLocales.map((loc) => (
                <SelectItem key={loc} value={loc.toUpperCase()}>
                    {loc.toUpperCase()}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
  );
}
