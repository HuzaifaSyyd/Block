import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/db"
import { compare, hash } from "bcryptjs"
import User from "@/lib/models/user"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Connecting to database for auth...")
          await connectToDatabase()

          console.log("Looking up user:", credentials.email)
          const user = await User.findOne({ email: credentials.email })

          // For demo accounts, allow direct password comparison
          if (
            (credentials.email === "admin@example.com" && credentials.password === "admin123") ||
            (credentials.email === "user@example.com" && credentials.password === "user123")
          ) {
            // If user doesn't exist in DB, create it
            if (!user) {
              console.log("Creating demo user:", credentials.email)
              const hashedPassword = await hash(credentials.password, 12)
              const newUser = new User({
                name: credentials.email === "admin@example.com" ? "Admin User" : "Regular User",
                email: credentials.email,
                password: hashedPassword,
                role: credentials.email === "admin@example.com" ? "admin" : "user",
              })

              try {
                await newUser.save()
                console.log("Created demo user with ID:", newUser._id)
              } catch (e) {
                console.error("Error creating demo user:", e)
                // Continue even if this fails
              }

              return {
                id: newUser.email,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
              }
            }

            console.log("Demo user authenticated:", credentials.email)
            return {
              id: user.email,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          // For regular accounts, verify password hash
          console.log("Verifying password for:", credentials.email)
          const isValid = await compare(credentials.password, user.password)

          if (!isValid) {
            console.log("Invalid password for:", credentials.email)
            return null
          }

          console.log("User authenticated successfully:", credentials.email)
          return {
            id: user.email,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
