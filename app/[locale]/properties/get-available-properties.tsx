type SearchParams = {
  city?: string;
  datetime?: string;
  endtime?: string;
  minPrice?: number;
  maxPrice?: number;
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return value !== null && typeof value === 'object' && 'then' in value && typeof (value as Record<string, unknown>).then === 'function';
}

export default async function getAvailableProperties(
  params: SearchParams | Promise<SearchParams>, 
  filter: string | null = null
) {
  let parsed: SearchParams = params as SearchParams
  
  if (isPromise<SearchParams>(params)) {
    parsed = await params
  }

  const { city, datetime, endtime, minPrice, maxPrice } = parsed
  
  if (city && datetime && endtime) {
    try {
      const urlParams = new URLSearchParams()
      urlParams.set("city", city)
      urlParams.set("startTime", datetime)
      urlParams.set("endTime", endtime)
      if (minPrice !== undefined && minPrice !== null) {
        urlParams.set("minPrice", String(minPrice))
      }
      if (maxPrice !== undefined && maxPrice !== null) {
        urlParams.set("maxPrice", String(maxPrice))
      }
      if (filter) {
        urlParams.set("filterBy", filter);
      }
      
      const res = await fetch(`/api/properties/getAvailable?${urlParams.toString()}`)
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
    
      return data
    } catch (error) {
      console.error("Error fetching available properties:", error)
      return []
    }
  }
  return []
}