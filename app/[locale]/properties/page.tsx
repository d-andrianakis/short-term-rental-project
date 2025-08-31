'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SearchBar() {
    const searchParams = useSearchParams()
 
    const city = searchParams.get('city')
    const datetime = searchParams.get('datetime');
 
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
    return <>
        <div>
            City: {city}
        </div>
        <div>
            Datetime: {datetime}
        </div>
    </>
}