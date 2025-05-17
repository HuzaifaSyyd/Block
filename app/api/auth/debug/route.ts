import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"

// This is a diagnostic endpoint to check MongoDB connection
export async function GET() {
  try {
    console.log("Starting MongoDB connection test...")

    // Test MongoDB connection
    await connectToDatabase()

    // Get connection status
    const connectionState = mongoose.connection.readyState
    const connectionStateText = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }[connectionState]

    // Get database name
    const dbName = mongoose.connection.name

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Check if we can write to the database
    const testCollection = mongoose.connection.collection("_test_write")
    const testResult = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
    })

    // Clean up test collection
    await testCollection.deleteOne({ _id: testResult.insertedId })

    return NextResponse.json({
      status: "success",
      message: "MongoDB connection successful",
      connectionState: connectionStateText,
      database: dbName,
      collections: collectionNames,
      writeTest: "passed",
      connectionString: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 15)}...` : "Not available",
      mongooseVersion: mongoose.version,
    })
  } catch (error) {
    console.error("MongoDB connection test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "MongoDB connection failed",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        connectionString: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 15)}...` : "Not available",
        mongooseVersion: mongoose.version,
      },
      { status: 500 },
    )
  }
}
