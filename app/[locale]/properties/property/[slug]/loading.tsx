import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex space-x-5">
      <div className="w-3/4 space-y-3">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className="w-1/4 space-y-5">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
