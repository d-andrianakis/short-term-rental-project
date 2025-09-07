
import { loadSearchParams  } from './searchParams'

export default async function getAvailableProperties(params: string) {
  const { city, datetime } = await loadSearchParams(params)
  console.log(`city is ${city} and datetime is ${datetime}`)
}