"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddGarageForm from "./add-garage-form"

const categories = [
  { id: "all", name: "All" },
  { id: "garage", name: "Garage" },
  { id: "parts", name: "Parts" },
  { id: "travel", name: "Travel" },
]

export default function GarageSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

  // Set active category based on URL params when component mounts
  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setActiveCategory(category.toLowerCase())
    } else {
      setActiveCategory("all")
    }
  }, [searchParams])

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)

    if (categoryId === "all") {
      router.push("/garage")
    } else {
      router.push(`/garage?category=${categoryId}`)
    }
  }

  const isAdmin = session?.user && (session.user as any).role === "admin"

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Filter By Category</h2>

      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            className={`w-full justify-start ${activeCategory === category.id ? "gradient-bg" : ""}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-8 pt-4 border-t">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gradient-bg" variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Listing</DialogTitle>
              </DialogHeader>
              <AddGarageForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
