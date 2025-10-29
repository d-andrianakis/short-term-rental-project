import { 
    parseAsString,
    parseAsIsoDateTime,
    createLoader 
} from 'nuqs/server'

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const propertySearchParams = {
  city: parseAsString,
  datetime: parseAsIsoDateTime,
  endtime: parseAsIsoDateTime,
  minPrice: parseAsString,
  maxPrice: parseAsString
}

export const loadSearchParams = createLoader(propertySearchParams)