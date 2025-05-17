import { Suspense } from "react"
import GarageList from "@/components/garage/garage-list"
import GarageSidebar from "@/components/garage/garage-sidebar"
import GarageListSkeleton from "@/components/garage/garage-list-skeleton"

interface GaragePageProps {
  searchParams: { category?: string }
}

export default function GaragePage({ searchParams }: GaragePageProps) {
  const category = searchParams.category || "all"

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Garage Directory</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <GarageSidebar />
        </div>

        <div className="md:w-3/4">
          <Suspense fallback={<GarageListSkeleton />}>
            <GarageList category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
