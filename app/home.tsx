"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { TypeAnimation } from "react-type-animation"
import { useEffect, useState } from "react"

export default function Home() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [garagesRef, garagesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [eventsRef, eventsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // State for real events and garages
  const [events, setEvents] = useState([])
  const [garages, setGarages] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch real events and garages
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch events
        const eventsResponse = await fetch("/api/events?limit=3")
        const eventsData = await eventsResponse.json()

        // Fetch garages
        const garagesResponse = await fetch("/api/garages?limit=3")
        const garagesData = await garagesResponse.json()

        setEvents(eventsData.events || [])
        setGarages(garagesData.garages || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center"
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Car background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background"></div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div className="text-center max-w-4xl mx-auto" variants={staggerContainer}>
            <motion.h1 className="text-7xl md:text-9xl font-black tracking-tight mb-6 font-display" variants={fadeInUp}>
              <span className="gradient-text">
                BLOCK
                <br />
                PISTON
              </span>
            </motion.h1>
            <motion.div
              className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-bold"
              variants={fadeInUp}
            >
              <TypeAnimation
                sequence={[
                  "Connect with car enthusiasts.",
                  1000,
                  "Find the best garages.",
                  1000,
                  "Attend exciting automotive events.",
                  1000,
                  "Join the ultimate automotive community.",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Number.POSITIVE_INFINITY}
              />
            </motion.div>
            <motion.div className="mt-12" variants={fadeInUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/community">
                <Button size="lg" className="gradient-bg font-bold text-lg">
                  Join Community
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <ChevronDown className="h-8 w-8" />
            <span className="sr-only">Scroll down</span>
          </Button>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about-section"
        className="py-20 bg-muted/50"
        ref={aboutRef}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-black text-center mb-12 gradient-text" variants={fadeInUp}>
            About BlockPiston
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer}>
            <motion.div
              className="bg-card p-6 rounded-lg shadow-md"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-xl font-bold mb-4">Find Garages</h3>
              <p className="text-muted-foreground">
                Discover top-rated garages and auto shops in your area. Read reviews, check availability, and book
                appointments.
              </p>
            </motion.div>
            <motion.div
              className="bg-card p-6 rounded-lg shadow-md"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-xl font-bold mb-4">Attend Events</h3>
              <p className="text-muted-foreground">
                Stay updated on car shows, races, and meetups. Purchase tickets and connect with other attendees.
              </p>
            </motion.div>
            <motion.div
              className="bg-card p-6 rounded-lg shadow-md"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-xl font-bold mb-4">Join Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow car enthusiasts, share your experiences, and get advice from experts in our
                community forums.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Garages */}
      <motion.section
        className="py-20"
        ref={garagesRef}
        initial="hidden"
        animate={garagesInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-black text-center mb-12 gradient-text" variants={fadeInUp}>
            Featured Garages
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
            {loading
              ? // Loading skeletons
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse"
                      variants={cardVariants}
                    >
                      <div className="h-48 bg-muted"></div>
                      <div className="p-6">
                        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full mb-4"></div>
                        <div className="h-10 bg-muted rounded w-full"></div>
                      </div>
                    </motion.div>
                  ))
              : garages.length > 0
                ? // Real garages
                  garages.map((garage) => (
                    <motion.div
                      key={garage._id}
                      className="bg-card rounded-lg overflow-hidden shadow-md"
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="relative h-48">
                        <Image
                          src={garage.image || "/placeholder.svg?height=300&width=500"}
                          alt={garage.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{garage.name}</h3>
                        <div className="flex items-center mb-2">
                          <div className="text-yellow-500 flex">
                            {Array(5)
                              .fill(0)
                              .map((_, idx) => (
                                <span key={idx}>★</span>
                              ))}
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">({garage.reviewCount} reviews)</span>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{garage.description}</p>
                        <Link href={`/garage/${garage._id}`}>
                          <Button variant="outline" className="w-full font-bold">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))
                : // Fallback if no garages
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-card rounded-lg overflow-hidden shadow-md"
                        variants={cardVariants}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="relative h-48">
                          <Image
                            src={`/placeholder.svg?height=300&width=500&text=Garage ${i + 1}`}
                            alt={`Featured Garage ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">Premium Garage {i + 1}</h3>
                          <div className="flex items-center mb-2">
                            <div className="text-yellow-500 flex">
                              {Array(5)
                                .fill(0)
                                .map((_, idx) => (
                                  <span key={idx}>★</span>
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">(120 reviews)</span>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Specializing in performance tuning and custom modifications for sports cars.
                          </p>
                          <Link href={`/garage/${i + 1}`}>
                            <Button variant="outline" className="w-full font-bold">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
          </motion.div>
          <motion.div
            className="mt-12 text-center"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/garage">
              <Button className="gradient-bg font-bold">View All Garages</Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Upcoming Events */}
      <motion.section
        className="py-20 bg-muted/50"
        ref={eventsRef}
        initial="hidden"
        animate={eventsInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl font-black text-center mb-12 gradient-text" variants={fadeInUp}>
            Upcoming Events
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
            {loading
              ? // Loading skeletons
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse"
                      variants={cardVariants}
                    >
                      <div className="h-48 bg-muted"></div>
                      <div className="p-6">
                        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-10 bg-muted rounded w-1/3"></div>
                          <div className="h-10 bg-muted rounded w-1/3"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              : events.length > 0
                ? // Real events
                  events.map((event) => (
                    <motion.div
                      key={event._id}
                      className="bg-card rounded-lg overflow-hidden shadow-md"
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="relative h-48">
                        {event.mediaType === "video" ? (
                          <video
                            src={event.mediaUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <Image
                            src={event.mediaUrl || "/placeholder.svg?height=300&width=500"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute top-4 right-4 gradient-bg px-3 py-1 rounded-full text-sm font-medium text-white">
                          ₹{event.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex justify-between items-center">
                          <Link href={`/events/${event._id}`}>
                            <Button variant="outline" className="font-bold">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/events/${event._id}/tickets`}>
                            <Button className="gradient-bg font-bold">Get Tickets</Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                : // Fallback if no events
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-card rounded-lg overflow-hidden shadow-md"
                        variants={cardVariants}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="relative h-48">
                          <Image
                            src={`/placeholder.svg?height=300&width=500&text=Event ${i + 1}`}
                            alt={`Event ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 right-4 gradient-bg px-3 py-1 rounded-full text-sm font-medium text-white">
                            {new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">Car Show & Exhibition {i + 1}</h3>
                          <p className="text-muted-foreground mb-4">
                            Join us for the biggest car show of the year featuring classic and modern vehicles.
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">₹4999</span>
                            <Link href={`/events/${i + 1}`}>
                              <Button size="sm" className="gradient-bg font-bold">
                                Get Tickets
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
          </motion.div>
          <motion.div
            className="mt-12 text-center"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/events">
              <Button className="gradient-bg font-bold">View All Events</Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 gradient-bg"
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 className="text-3xl font-black mb-6 text-white" variants={fadeInUp}>
            Join Our Community Today
          </motion.h2>
          <motion.p className="text-xl mb-8 max-w-2xl mx-auto text-white/90 font-bold" variants={fadeInUp}>
            Connect with thousands of car enthusiasts, access exclusive events, and find the best garages in your area.
          </motion.p>
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="font-bold text-lg">
                Sign Up Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
