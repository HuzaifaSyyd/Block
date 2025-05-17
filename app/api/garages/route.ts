import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Garage from "@/lib/models/garage"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const category = url.searchParams.get("category")

    await connectToDatabase()

    // Build query
    const query = category ? { category } : {}

    // Get garages
    const garages = await Garage.find(query).sort({ rating: -1 }).limit(limit)

    return NextResponse.json({
      garages: JSON.parse(JSON.stringify(garages)),
      total: await Garage.countDocuments(query),
    })
  } catch (error) {
    console.error("Error fetching garages:", error)
    return NextResponse.json({ error: "Failed to fetch garages" }, { status: 500 })
  }
}
