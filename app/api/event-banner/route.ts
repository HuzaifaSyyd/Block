import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"

// Define the EventBanner schema if it doesn't exist
let EventBanner
try {
  EventBanner = mongoose.model("EventBanner")
} catch {
  const EventBannerSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    imageUrl: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  })
  EventBanner = mongoose.models.EventBanner || mongoose.model("EventBanner", EventBannerSchema)
}

export async function GET() {
  try {
    await connectToDatabase()

    // Get the banner
    const banner = await EventBanner.findOne({})

    return NextResponse.json({
      banner: banner ? JSON.parse(JSON.stringify(banner)) : null,
    })
  } catch (error) {
    console.error("Error fetching event banner:", error)
    return NextResponse.json({ error: "Failed to fetch event banner" }, { status: 500 })
  }
}
