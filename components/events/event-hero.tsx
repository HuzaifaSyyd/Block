"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateEventBanner } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
})

export default function EventHero({ banner = null }) {
  const { data: session } = useSession()
  const isAdmin = session?.user && (session.user as any).role === "admin"
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [bannerData, setBannerData] = useState(banner)

  // Fetch banner data if not provided
  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch("/api/event-banner")
        if (response.ok) {
          const data = await response.json()
          if (data.banner) {
            setBannerData(data.banner)
          }
        }
      } catch (error) {
        console.error("Failed to fetch banner:", error)
      }
    }

    if (!banner) {
      fetchBanner()
    }
  }, [banner])

  // Default banner data if none provided
  const defaultBanner = {
    title: bannerData?.title || "Automotive Events",
    subtitle:
      bannerData?.subtitle || "Discover and attend the most exciting car shows, races, and meetups in your area.",
    imageUrl: bannerData?.imageUrl || "/placeholder.svg?height=800&width=1600&text=Events",
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultBanner,
  })

  // Update form values when banner data changes
  useEffect(() => {
    if (bannerData) {
      form.reset({
        title: bannerData.title || defaultBanner.title,
        subtitle: bannerData.subtitle || defaultBanner.subtitle,
        imageUrl: bannerData.imageUrl || defaultBanner.imageUrl,
      })
    }
  }, [bannerData, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateEventBanner(values)
      toast({
        title: "Success",
        description: "Banner updated successfully",
      })
      setBannerData(values)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to update banner:", error)
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative h-[400px] w-full">
      <Image
        src={defaultBanner.imageUrl || "/placeholder.svg"}
        alt="Events Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-background/30 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{defaultBanner.title}</h1>
            <p className="text-xl text-muted-foreground">{defaultBanner.subtitle}</p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="absolute top-4 right-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Banner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Event Banner</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gradient-bg">
                    Update Banner
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
