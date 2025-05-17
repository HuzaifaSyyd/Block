"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const backgroundSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Please enter a valid URL"),
})

const bannerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
})

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Background form
  const backgroundForm = useForm<z.infer<typeof backgroundSchema>>({
    resolver: zodResolver(backgroundSchema),
    defaultValues: {
      type: "image",
      url: "/placeholder.svg?height=1080&width=1920",
    },
  })

  // Banner form
  const bannerForm = useForm<z.infer<typeof bannerSchema>>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "Automotive Events",
      subtitle: "Discover and attend the most exciting car shows, races, and meetups in your area.",
      imageUrl: "/placeholder.svg?height=800&width=1600&text=Events",
    },
  })

  // Check if user is admin
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/")
    }
  }, [session, status, router])

  // Fetch current settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        // Fetch background
        const backgroundResponse = await fetch("/api/background")
        const backgroundData = await backgroundResponse.json()

        if (backgroundData.background) {
          backgroundForm.reset({
            type: backgroundData.background.type || "image",
            url: backgroundData.background.url || "/placeholder.svg?height=1080&width=1920",
          })
        }

        // Fetch banner
        const bannerResponse = await fetch("/api/event-banner")
        const bannerData = await bannerResponse.json()

        if (bannerData.banner) {
          bannerForm.reset({
            title: bannerData.banner.title || "Automotive Events",
            subtitle:
              bannerData.banner.subtitle ||
              "Discover and attend the most exciting car shows, races, and meetups in your area.",
            imageUrl: bannerData.banner.imageUrl || "/placeholder.svg?height=800&width=1600&text=Events",
          })
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchSettings()
    }
  }, [session, status, backgroundForm, bannerForm])

  // Handle background form submission
  const onBackgroundSubmit = async (values: z.infer<typeof backgroundSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update background")
      }

      toast({
        title: "Success",
        description: "Background updated successfully",
      })
    } catch (error) {
      console.error("Error updating background:", error)
      toast({
        title: "Error",
        description: "Failed to update background",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle banner form submission
  const onBannerSubmit = async (values: z.infer<typeof bannerSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/event-banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update banner")
      }

      toast({
        title: "Success",
        description: "Banner updated successfully",
      })
    } catch (error) {
      console.error("Error updating banner:", error)
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If not authenticated or not admin, show loading
  if (status === "loading" || (status === "authenticated" && (session?.user as any)?.role !== "admin")) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Admin Settings</h1>

      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="background">Home Background</TabsTrigger>
          <TabsTrigger value="banner">Event Banner</TabsTrigger>
        </TabsList>

        <TabsContent value="background">
          <Card>
            <CardHeader>
              <CardTitle>Home Page Background</CardTitle>
              <CardDescription>
                Customize the background of the home page. You can use either an image or a video.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...backgroundForm}>
                <form onSubmit={backgroundForm.handleSubmit(onBackgroundSubmit)} className="space-y-6">
                  <FormField
                    control={backgroundForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Background Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="image" id="image" />
                              <Label htmlFor="image">Image</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="video" id="video" />
                              <Label htmlFor="video">Video</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={backgroundForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/background.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of the {backgroundForm.watch("type")} you want to use as background.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="h-40 relative rounded-md overflow-hidden">
                    {backgroundForm.watch("type") === "video" ? (
                      <video
                        src={backgroundForm.watch("url")}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={backgroundForm.watch("url") || "/placeholder.svg"}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Background"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner">
          <Card>
            <CardHeader>
              <CardTitle>Event Banner</CardTitle>
              <CardDescription>Customize the banner that appears on the events page.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...bannerForm}>
                <form onSubmit={bannerForm.handleSubmit(onBannerSubmit)} className="space-y-6">
                  <FormField
                    control={bannerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Automotive Events" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bannerForm.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Discover and attend the most exciting car shows, races, and meetups in your area."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bannerForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/banner.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="h-40 relative rounded-md overflow-hidden">
                    <img
                      src={bannerForm.watch("imageUrl") || "/placeholder.svg"}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/30 flex items-center">
                      <div className="p-4">
                        <h3 className="text-xl font-bold">{bannerForm.watch("title")}</h3>
                        <p className="text-sm text-muted-foreground">{bannerForm.watch("subtitle")}</p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Banner"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
