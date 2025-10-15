import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div role="status" className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export default function Loading() {
  const count = 4;
  const key = Math.random().toString(36).slice(2);
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={key + '-' + i} />
      ))}
    </div>
  );
}
