import { loadSearchParams  } from './searchParams'

export default async function getAvailableProperties(params: any, filter: any = null) {
  const { city, datetime, endtime, minPrice, maxPrice } = await loadSearchParams(params)

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