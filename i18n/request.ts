import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
 
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // const store = await cookies();
  // const locale = store.get('locale')?.value || 'en';

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});