
import { loadSearchParams  } from './searchParams'

import { db } from '@/db/drizzle';
import { properties, bookings } from '@/db/schema';

import { and, lt, gt } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/gel-core';

export default async function getAvailableProperties(params: string) {
  const { city, datetime, endtime } = await loadSearchParams(params)
  const tenDays = 10 * 24 * 60 * 60 * 1000;
  
  function toTimestamp(datetimeStr: string): number {
    return new Date(datetimeStr).getTime();
  }

  if (city && datetime && endtime) {
    try {
      const startTime = toTimestamp(datetime);

      // const endDate = new Date(endtime);
      // const endTime = endDate.getTime();
      const endTime = toTimestamp(endtime);

      const params = new URLSearchParams();
      params.set("city", city);
      params.set("startTime", startTime);
      params.set("endTime", endTime);
      const res = await fetch(`/api/properties/getAvailable?${params.toString()}`);

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  console.log(`city is ${city} and datetime is ${datetime}`)
}