"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ThumbsUp, Trash2, Reply } from "lucide-react"
import { likeMessage, deleteMessage } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function MessageItem({ message }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [likes, setLikes] = useState(message.likes)
  const { toast } = useToast()

  const isAdmin = session?.user && (session.user as any).role === "admin"
  const userId = session?.user?.email
  const hasLiked = message.likedBy?.includes(userId)

  const formattedDate = new Date(message.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  const handleLike = async () => {
    if (!session) return
    if (hasLiked) {
      toast({
        title: "Already liked",
        description: "You have already liked this message",
      })
      return
    }

    try {
      setIsLiking(true)
      const result = await likeMessage(message._id)

      if (result.success) {
        setLikes(likes + 1)
        // Add user to local likedBy array to prevent multiple likes
        message.likedBy = [...(message.likedBy || []), userId]

        toast({
          title: "Liked",
          description: "You liked this message",
        })
      } else {
        toast({
          title: "Note",
          description: result.message || "Could not like message",
        })
      }
    } catch (error) {
      console.error("Failed to like message:", error)
      toast({
        title: "Error",
        description: "Failed to like message",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!isAdmin) return

    try {
      setIsDeleting(true)
      await deleteMessage(message._id)
      toast({
        title: "Deleted",
        description: "Message has been deleted",
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to delete message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              <Avatar>
                <AvatarImage src={message.user.image || "/placeholder.svg"} alt={message.user.name} />
                <AvatarFallback className="gradient-bg text-white">
                  {message.user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{message.user.name}</p>
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <p className="mt-2">{message.content}</p>

              {/* Display media if present */}
              {message.mediaType === "image" && message.mediaUrl && (
                <div className="mt-3 rounded-md overflow-hidden">
                  <img
                    src={message.mediaUrl || "/placeholder.svg"}
                    alt="Shared image"
                    className="max-w-full max-h-80 object-contain"
                  />
                </div>
              )}

              {message.mediaType === "video" && message.mediaUrl && (
                <div className="mt-3 rounded-md overflow-hidden">
                  <video src={message.mediaUrl} controls className="max-w-full max-h-80">
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${hasLiked ? "text-primary" : ""}`}
                onClick={handleLike}
                disabled={isLiking || !session || hasLiked}
              >
                <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                <span>{likes}</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" className="flex items-center gap-1" disabled={!session}>
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </Button>
            </motion.div>
          </div>
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
