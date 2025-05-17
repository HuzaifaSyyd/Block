import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Event from "@/lib/models/event"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    await connectToDatabase()

    // Get upcoming events sorted by date
    const events = await Event.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(limit)

    return NextResponse.json({
      events: JSON.parse(JSON.stringify(events)),
      total: await Event.countDocuments({ date: { $gte: new Date() } }),
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
