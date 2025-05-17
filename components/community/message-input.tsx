"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ImageIcon, Video, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MessageInput() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [mediaType, setMediaType] = useState("none")
  const [mediaUrl, setMediaUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && mediaType === "none") {
      toast({
        title: "Error",
        description: "Please enter a message or add media",
        variant: "destructive",
      })
      return
    }

    if ((mediaType === "image" || mediaType === "video") && !mediaUrl) {
      toast({
        title: "Error",
        description: `Please provide a valid ${mediaType} URL`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await sendMessage({
        content: message,
        mediaType,
        mediaUrl,
      })
      setMessage("")
      setMediaType("none")
      setMediaUrl("")

      toast({
        title: "Message sent",
        description: "Your message has been posted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Join the Conversation</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!session) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Join the Conversation</CardTitle>
            <CardDescription>Sign in to participate in the community discussion.</CardDescription>
          </CardHeader>
          <CardFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/login">
                <Button className="gradient-bg">Sign In</Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Join the Conversation</CardTitle>
          <CardDescription>Share your thoughts with the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="text" onClick={() => setMediaType("none")}>
                Text
              </TabsTrigger>
              <TabsTrigger value="image" onClick={() => setMediaType("image")}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video" onClick={() => setMediaType("video")}>
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Textarea
                  placeholder="What's on your mind?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] bg-card"
                />
              </motion.div>
            </TabsContent>
            <TabsContent value="image">
              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Textarea
                    placeholder="Add a caption to your image..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[60px] bg-card"
                  />
                </motion.div>
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
                {mediaUrl && (
                  <div className="mt-2 relative h-40 rounded-md overflow-hidden">
                    <img src={mediaUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="video">
              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Textarea
                    placeholder="Add a caption to your video..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[60px] bg-card"
                  />
                </motion.div>
                <Input
                  type="url"
                  placeholder="Enter video URL"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
                {mediaUrl && (
                  <div className="mt-2 relative h-40 rounded-md overflow-hidden">
                    <video src={mediaUrl} controls className="w-full h-full object-cover">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (!message.trim() && mediaType === "none")}
              className="gradient-bg"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
