import { Skeleton } from '@/components/ui/skeleton';

export function MemoryListSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </header>

      {/* Filters */}
      <div className="border-b bg-card/50 px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
