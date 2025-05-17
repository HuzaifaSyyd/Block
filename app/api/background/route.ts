import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Define the Background schema if it doesn't exist
let Background
try {
  Background = mongoose.model("Background")
} catch {
  const BackgroundSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    url: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  })
  Background = mongoose.models.Background || mongoose.model("Background", BackgroundSchema)
}

export async function GET() {
  try {
    await connectToDatabase()

    // Get the background
    const background = await Background.findOne({})

    return NextResponse.json({
      background: background ? JSON.parse(JSON.stringify(background)) : null,
    })
  } catch (error) {
    console.error("Error fetching background:", error)
    return NextResponse.json({ error: "Failed to fetch background" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, url } = body

    if (!type || !url) {
      return NextResponse.json({ error: "Type and URL are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find existing background or create new one
    let background = await Background.findOne({})

    if (background) {
      background.type = type
      background.url = url
      background.updatedAt = new Date()
      await background.save()
    } else {
      background = new Background({
        type,
        url,
      })
      await background.save()
    }

    return NextResponse.json({
      background: JSON.parse(JSON.stringify(background)),
      message: "Background updated successfully",
    })
  } catch (error) {
    console.error("Error updating background:", error)
    return NextResponse.json({ error: "Failed to update background" }, { status: 500 })
  }
}
