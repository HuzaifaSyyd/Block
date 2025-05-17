import { Skeleton } from "@/components/ui/skeleton"

export default function EventListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md">
          <Skeleton className="h-48 w-full" />
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />

            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <Skeleton className="h-4 w-full mb-4" />

            <div className="flex justify-between items-center">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
