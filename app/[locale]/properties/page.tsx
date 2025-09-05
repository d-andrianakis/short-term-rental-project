import { loadSearchParams } from './search-params'
import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const { city, datetime } = await loadSearchParams(searchParams)

  console.log(city, datetime);

//   const results = await db
//     .select()
//     .from(properties)
//     .where(city ? (properties.city.eq(city)) : undefined)

  return (
    <div>
      {/* <SearchBar /> */}
      <div>
        <h2>Results</h2>
        {/* {results.length > 0 ? (
          <ul>
            {results.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <p>No properties found</p>
        )} */}
      </div>
    </div>
  )
}