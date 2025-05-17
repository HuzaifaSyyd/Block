import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    console.log("Starting signup process...")

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", { ...body, password: body.password ? "[REDACTED]" : undefined })
    } catch (e) {
      console.error("Error parsing request body:", e)
      return NextResponse.json(
        {
          message: "Invalid request body",
          error: e.message,
        },
        { status: 400 },
      )
    }

    const { name, email, password, role = "user" } = body

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["user", "admin"]
    if (role && !validRoles.includes(role)) {
      console.log("Invalid role:", role)
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    // Connect to database
    try {
      console.log("Connecting to database...")
      await connectToDatabase()
      console.log("Database connection successful")
    } catch (e) {
      console.error("Database connection error:", e)
      return NextResponse.json(
        {
          message: "Database connection error",
          error: e.message,
          stack: process.env.NODE_ENV === "development" ? e.stack : undefined,
        },
        { status: 500 },
      )
    }

    // Check if user already exists
    try {
      console.log("Checking if user exists:", email)
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        console.log("User already exists")
        return NextResponse.json({ message: "User already exists" }, { status: 409 })
      }
    } catch (e) {
      console.error("Error checking existing user:", e)
      return NextResponse.json(
        {
          message: "Error checking existing user",
          error: e.message,
        },
        { status: 500 },
      )
    }

    // Hash password
    let hashedPassword
    try {
      console.log("Hashing password...")
      hashedPassword = await hash(password, 12)
      console.log("Password hashed successfully")
    } catch (e) {
      console.error("Error hashing password:", e)
      return NextResponse.json(
        {
          message: "Error hashing password",
          error: e.message,
        },
        { status: 500 },
      )
    }

    // Create new user
    try {
      console.log("Creating new user:", { name, email, role })
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      })

      await newUser.save()
      console.log("User created with ID:", newUser._id)

      return NextResponse.json(
        {
          message: "User created successfully",
          userId: newUser._id,
        },
        { status: 201 },
      )
    } catch (e) {
      console.error("Error creating user:", e)
      return NextResponse.json(
        {
          message: "Error creating user",
          error: e.message,
          stack: process.env.NODE_ENV === "development" ? e.stack : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unhandled error in signup route:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
