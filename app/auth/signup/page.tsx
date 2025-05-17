"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["user", "admin"]).default("user"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignupPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "success" | "error">("unknown")
  const [connectionDetails, setConnectionDetails] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  })

  // Check MongoDB connection
  const checkConnection = async () => {
    try {
      const response = await fetch("/api/auth/debug")
      const data = await response.json()

      setConnectionDetails(data)
      setConnectionStatus(data.status === "success" ? "success" : "error")

      if (data.status !== "success") {
        setDebugInfo(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      console.error("Error checking connection:", error)
      setConnectionStatus("error")
      setConnectionDetails({ error: error.message })
      setDebugInfo(JSON.stringify({ error: error.message }, null, 2))
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setDebugInfo(null)

    try {
      console.log("Submitting form:", { ...values, password: "[REDACTED]" })

      // Call the API to create a new user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      })

      const data = await response.json()
      console.log("API response:", data)

      if (!response.ok) {
        // Show detailed error for debugging
        setDebugInfo(JSON.stringify(data, null, 2))
        throw new Error(data.message || "Something went wrong")
      }

      setSuccess(true)
      form.reset()

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  // Check if the current user is an admin
  const isAdmin = session?.user && (session.user as any).role === "admin"

  return (
    <motion.div
      className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create a new BlockPiston account</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {debugInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-4 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                <details>
                  <summary>Debug Information (click to expand)</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-40">{debugInfo}</pre>
                </details>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Account created successfully! Redirecting to login...</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                        <li className={field.value.length >= 8 ? "text-green-500 dark:text-green-400" : ""}>
                          At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(field.value) ? "text-green-500 dark:text-green-400" : ""}>
                          At least one uppercase letter
                        </li>
                        <li className={/[a-z]/.test(field.value) ? "text-green-500 dark:text-green-400" : ""}>
                          At least one lowercase letter
                        </li>
                        <li className={/[0-9]/.test(field.value) ? "text-green-500 dark:text-green-400" : ""}>
                          At least one number
                        </li>
                        <li className={/[^A-Za-z0-9]/.test(field.value) ? "text-green-500 dark:text-green-400" : ""}>
                          At least one special character
                        </li>
                      </ul>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Only show role selection for admins */}
              {isAdmin && (
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full gradient-bg"
                  disabled={isLoading || success}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </motion.p>
        </CardFooter>
      </Card>

      {/* MongoDB Connection Test Button */}
      <motion.div variants={itemVariants} className="mt-4">
        <Button variant="outline" onClick={checkConnection} className="text-sm" size="sm">
          <Info className="h-4 w-4 mr-2" />
          Test MongoDB Connection
        </Button>
      </motion.div>

      {/* Connection Status */}
      {connectionStatus !== "unknown" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 text-sm"
        >
          {connectionStatus === "success" ? (
            <span className="text-green-500">✓ MongoDB connection successful</span>
          ) : (
            <span className="text-red-500">✗ MongoDB connection failed</span>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
