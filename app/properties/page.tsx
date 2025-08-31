'use client'

import {useTranslations} from 'next-intl';
import { useSearchParams } from 'next/navigation'
 
export default function SearchBar() {
    
    const t = useTranslations("Properties");

    const searchParams = useSearchParams()
    
    const city = searchParams.get('city')
    const datetime = searchParams.get('datetime')
    
    // URL -> `/dashboard?search=my-project`
    // `search` -> 'my-project'
    return <>
        { city &&
            <div>
                City: {city}
            </div>
        }

        { datetime && 
            <div>
                Datetime: {datetime}
            </div>
        }

        { !city && !datetime && 
            <div>
                <span>{ t('no_properties')}</span>
            </div>
        }
    </>
}