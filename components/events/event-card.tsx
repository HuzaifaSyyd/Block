"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

export default function EventCard({ event }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Ensure video plays when component mounts
  useEffect(() => {
    if (videoRef.current && event.mediaType === "video") {
      // Try to play the video
      const playVideo = async () => {
        try {
          await videoRef.current?.play()
        } catch (error) {
          console.error("Error playing video:", error)
        }
      }

      playVideo()
    }
  }, [event.mediaType])

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <motion.div
      className="bg-card rounded-lg overflow-hidden shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="relative h-48">
        {event.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={event.mediaUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <Image
            src={event.mediaUrl || "/placeholder.svg?height=300&width=500"}
            alt={event.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-4 right-4 gradient-bg text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          ₹{event.price.toFixed(2)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formattedDate}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

        <div className="flex justify-between items-center">
          <Link href={`/events/${event._id}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">View Details</Button>
            </motion.div>
          </Link>
          <Link href={`/events/${event._id}/tickets`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="gradient-bg">Get Tickets</Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
