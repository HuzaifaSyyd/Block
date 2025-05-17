"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { addGarage } from "@/lib/actions"
import { Clock, Mail, Phone } from "lucide-react"

// Base schema with common fields
const baseSchema = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Garage", "Parts", "Travel"]),
  location: z.string().min(5, "Location must be at least 5 characters"),
  image: z.string().url("Please enter a valid URL"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
}

// Create the form schema
const formSchema = z.object(baseSchema).and(
  z.discriminatedUnion("category", [
    z.object({
      category: z.literal("Garage"),
      openHours: z.string().min(2, "Please specify open hours"),
    }),
    z.object({
      category: z.literal("Parts"),
      availability: z.boolean().default(true),
    }),
    z.object({
      category: z.literal("Travel"),
      mapUrl: z.string().url("Please enter a valid map URL").optional().or(z.literal("")),
    }),
  ]),
)

interface AddGarageFormProps {
  onSuccess?: () => void
}

export default function AddGarageForm({ onSuccess }: AddGarageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Garage")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Garage" as const,
      location: "",
      image: "",
      email: "",
      phone: "",
      openHours: "Mon-Fri: 9am-6pm, Sat: 10am-4pm",
      availability: true,
      mapUrl: "",
    },
  })

  // Watch for category changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "category") {
        setSelectedCategory(value.category || "Garage")
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await addGarage(values)
      form.reset()
      router.refresh()
      onSuccess?.()
    } catch (error) {
      console.error("Failed to add garage:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get form title based on category
  const getFormTitle = () => {
    switch (selectedCategory) {
      case "Garage":
        return "Add Garage"
      case "Parts":
        return "Add Shop"
      case "Travel":
        return "Add Travel"
      default:
        return "Add Listing"
    }
  }

  return (
    <Form {...form}>
      <h2 className="text-xl font-bold mb-4">{getFormTitle()}</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={`${selectedCategory} name`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder={`Describe the ${selectedCategory.toLowerCase()} and its services`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Garage">Garage</SelectItem>
                    <SelectItem value="Parts">Shop</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input className="rounded-l-none" placeholder="contact@example.com" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input className="rounded-l-none" placeholder="+91 9876543210" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields based on category */}
        {selectedCategory === "Garage" && (
          <FormField
            control={form.control}
            name="openHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Hours</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Clock className="h-4 w-4" />
                    </span>
                    <Input className="rounded-l-none" placeholder="Mon-Fri: 9am-6pm, Sat: 10am-4pm" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedCategory === "Parts" && (
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Availability</FormLabel>
                  <div className="text-sm text-muted-foreground">Is this shop currently open for business?</div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {selectedCategory === "Travel" && (
          <FormField
            control={form.control}
            name="mapUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Map URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://maps.google.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full gradient-bg" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : `Add ${selectedCategory}`}
        </Button>
      </form>
    </Form>
  )
}
