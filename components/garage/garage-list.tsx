import GarageCard from "./garage-card"
import { getGarages } from "@/lib/data"

interface GarageListProps {
  category?: string
}

export default async function GarageList({ category }: GarageListProps) {
  // Convert category to proper case for filtering
  let categoryFilter = undefined
  if (category && category !== "all") {
    // Convert first letter to uppercase and rest to lowercase
    categoryFilter = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  }

  const garages = await getGarages(categoryFilter)

  if (garages.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No garages found</h3>
        <p className="text-muted-foreground mt-2">Try changing your filter or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {garages.map((garage) => (
        <GarageCard key={garage._id} garage={garage} />
      ))}
    </div>
  )
}
