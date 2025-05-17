import { connectToDatabase } from "./db"
import User from "./models/user"
import Garage from "./models/garage"
import Event from "./models/event"
import Message from "./models/message"

// Get all garages with optional category filter
export async function getGarages(category) {
  try {
    await connectToDatabase()

    const query = category ? { category } : {}
    const garages = await Garage.find(query).sort({ createdAt: -1 })

    return JSON.parse(JSON.stringify(garages))
  } catch (error) {
    console.error("Failed to fetch garages:", error)
    return []
  }
}

// Get a single garage by ID
export async function getGarageById(id) {
  try {
    await connectToDatabase()

    const garage = await Garage.findById(id)
    if (!garage) return null

    return JSON.parse(JSON.stringify(garage))
  } catch (error) {
    console.error("Failed to fetch garage:", error)
    return null
  }
}

// Get all events
export async function getEvents() {
  try {
    await connectToDatabase()

    const events = await Event.find({}).sort({ date: 1 })
    return JSON.parse(JSON.stringify(events))
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return []
  }
}

// Get a single event by ID
export async function getEventById(id) {
  try {
    await connectToDatabase()

    const event = await Event.findById(id)
    if (!event) return null

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    console.error("Failed to fetch event:", error)
    return null
  }
}

// Get all messages
export async function getMessages() {
  try {
    await connectToDatabase()

    const messages = await Message.find({}).sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(messages))
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return []
  }
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) return null

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}
