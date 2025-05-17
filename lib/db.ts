import mongoose from "mongoose"

// Check if MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not defined")
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const MONGODB_URI = process.env.MONGODB_URI

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using existing mongoose connection")
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log("Creating new mongoose connection")
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully via mongoose")
        return mongoose
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    console.error("Failed to connect to MongoDB:", e)
    throw e
  }
}

// Ensure all models are initialized
import "./models/user"
import "./models/garage"
import "./models/event"
import "./models/message"

// Export default connection for compatibility
export default connectToDatabase
