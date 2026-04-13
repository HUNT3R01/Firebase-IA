import { Skeleton } from '@/components/ui/skeleton';

export default function MyEventsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}