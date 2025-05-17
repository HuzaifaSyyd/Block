"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "./db"
import Garage from "./models/garage"
import Event from "./models/event"
import Message from "./models/message"
import mongoose from "mongoose"

// Garage operations
export async function addGarage(garageData) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    const newGarage = new Garage({
      ...garageData,
      rating: 0,
      reviewCount: 0,
    })

    await newGarage.save()

    revalidatePath("/garage")
    revalidatePath("/")
    return { success: true, id: newGarage._id }
  } catch (error) {
    console.error("Failed to add garage:", error)
    throw new Error("Failed to add garage")
  }
}

export async function updateGarage(id, garageData) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    await Garage.findByIdAndUpdate(id, {
      ...garageData,
      updatedAt: new Date(),
    })

    revalidatePath(`/garage/${id}`)
    revalidatePath("/garage")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update garage:", error)
    throw new Error("Failed to update garage")
  }
}

export async function deleteGarage(id) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    await Garage.findByIdAndDelete(id)

    revalidatePath("/garage")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete garage:", error)
    throw new Error("Failed to delete garage")
  }
}

// Event operations
export async function addEvent(eventData) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    const newEvent = new Event(eventData)
    await newEvent.save()

    revalidatePath("/events")
    revalidatePath("/")
    return { success: true, id: newEvent._id }
  } catch (error) {
    console.error("Failed to add event:", error)
    throw new Error("Failed to add event")
  }
}

export async function updateEvent(id, eventData) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    await Event.findByIdAndUpdate(id, {
      ...eventData,
      updatedAt: new Date(),
    })

    revalidatePath(`/events/${id}`)
    revalidatePath("/events")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update event:", error)
    throw new Error("Failed to update event")
  }
}

export async function deleteEvent(id) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    await Event.findByIdAndDelete(id)

    revalidatePath("/events")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete event:", error)
    throw new Error("Failed to delete event")
  }
}

// Message operations
export async function sendMessage({ content, mediaType = "none", mediaUrl = "" }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    const newMessage = new Message({
      content,
      mediaType,
      mediaUrl,
      user: {
        id: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      likes: 0,
      likedBy: [],
    })

    await newMessage.save()

    revalidatePath("/community")
    return { success: true }
  } catch (error) {
    console.error("Failed to send message:", error)
    throw new Error("Failed to send message")
  }
}

export async function likeMessage(messageId) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    // Get the message
    const message = await Message.findById(messageId)

    if (!message) {
      throw new Error("Message not found")
    }

    // Check if user already liked this message
    const userId = session.user.email
    if (message.likedBy.includes(userId)) {
      return { success: false, message: "You already liked this message" }
    }

    // Add user to likedBy array and increment likes count
    await Message.findByIdAndUpdate(messageId, {
      $inc: { likes: 1 },
      $push: { likedBy: userId },
    })

    revalidatePath("/community")
    return { success: true }
  } catch (error) {
    console.error("Failed to like message:", error)
    throw new Error("Failed to like message")
  }
}

export async function deleteMessage(messageId) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    await Message.findByIdAndDelete(messageId)

    revalidatePath("/community")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete message:", error)
    throw new Error("Failed to delete message")
  }
}

// Banner operations
export async function updateEventBanner(bannerData) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await connectToDatabase()

    // Find the current banner
    let banner = await mongoose.models.EventBanner?.findOne({})

    if (banner) {
      // Update existing banner
      banner.title = bannerData.title
      banner.subtitle = bannerData.subtitle
      banner.imageUrl = bannerData.imageUrl
      await banner.save()
    } else {
      // Create banner model if it doesn't exist
      const EventBannerSchema = new mongoose.Schema({
        title: String,
        subtitle: String,
        imageUrl: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      })

      const EventBanner = mongoose.models.EventBanner || mongoose.model("EventBanner", EventBannerSchema)

      // Create new banner
      banner = new EventBanner(bannerData)
      await banner.save()
    }

    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    console.error("Failed to update event banner:", error)
    throw new Error("Failed to update event banner")
  }
}
