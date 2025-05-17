import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getEventById } from "@/lib/data"
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Heart } from "lucide-react"

interface EventDetailsPageProps {
  params: { id: string }
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  // External booking URL for tickets
  const bookingUrl = "https://www.bookmyshow.com/events"

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/events" className="flex items-center text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
            {event.mediaType === "video" ? (
              <video
                src={event.mediaUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={event.mediaUrl || "/placeholder.svg?height=600&width=1200"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-muted-foreground">{formattedDate}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-muted-foreground">{formattedTime}</div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-primary" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-muted-foreground">{event.location}</div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <h2>About this Event</h2>
            <p>{event.description}</p>

            <h2>What to Expect</h2>
            <ul>
              <li>Exclusive car displays from top Tuners</li>
              <li>Live demonstrations and performances</li>
              <li>Food and beverages available for purchase</li>
              <li>Networking opportunities with industry professionals</li>
              <li>Prizes and giveaways throughout the event</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg p-6 shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-4">Ticket Information</h2>

            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">₹{event.price.toFixed(2)}</div>
              <p className="text-muted-foreground">
                Includes entry to all exhibits and demonstrations. Food and beverages available for purchase separately.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span>Regular Admission</span>
                <span>₹{event.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>VIP Package</span>
                <span>₹{(event.price * 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Family Pack (4 tickets)</span>
                <span>₹{(event.price * 3.5).toFixed(2)}</span>
              </div>
            </div>

            <Link href={`/events/${event._id}/tickets`}>
              <Button className="w-full gradient-bg mb-3">Get Tickets</Button>
            </Link>
            <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Buy Tickets Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
