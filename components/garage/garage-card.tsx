"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function GarageCard({ garage }) {
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
        <Image
          src={garage.image || "/placeholder.svg?height=300&width=500"}
          alt={garage.name}
          fill
          className="object-cover"
        />
        {garage.category === "Parts" && (
          <Badge
            variant={garage.availability ? "default" : "secondary"}
            className={`absolute top-4 right-4 ${garage.availability ? "gradient-bg" : ""}`}
          >
            {garage.availability ? "Available" : "Unavailable"}
          </Badge>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{garage.name}</h3>
          <Badge variant="outline">{garage.category}</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-2">{garage.location}</p>

        <div className="flex items-center mb-4">
          <div className="flex items-center text-yellow-500">
            <Star className="fill-current h-4 w-4" />
            <span className="ml-1 font-medium">{garage.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-2">({garage.reviewCount} reviews)</span>
        </div>

        {garage.category === "Garage" && garage.openHours && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4 mr-2" />
            <span>{garage.openHours}</span>
          </div>
        )}

        {garage.phone && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Phone className="h-4 w-4 mr-2" />
            <span>{garage.phone}</span>
          </div>
        )}

        {garage.email && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{garage.email}</span>
          </div>
        )}

        <Link href={`/garage/${garage._id}`}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
