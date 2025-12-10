"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useIsMobile } from "@/hooks/is-mobile";

export default function Loading() {
  const isMobile = useIsMobile();
  return (
    <div className={`flex space-x-5 ${isMobile ? "flex-col space-y-4" : ""}`}>
      <div className={ isMobile ? "w-full" : "w-3/4 space-y-3"}>
        <Skeleton className={`w-full mb-1 ${isMobile ? "h-48" : "h-96"}`} />
        <Skeleton className="h-8 w-1/2 mb-1" />
        <Skeleton className="h-8 w-1/2 mb-1" />
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className={ isMobile ? "w-full" : "w-1/4 space-y-5"}>
        <Skeleton className="h-8 w-full mb-1" />
        <Skeleton className="h-8 w-full mb-1" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
