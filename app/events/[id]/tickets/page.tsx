import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getEventById } from "@/lib/data"
import { ArrowLeft, CreditCard, Calendar, Ticket } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface TicketsPageProps {
  params: { id: string }
}

export default async function TicketsPage({ params }: TicketsPageProps) {
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

  // External booking URL for tickets - this would typically come from your database
  // For now, we'll use a placeholder
  const bookingUrl = "https://www.bookmyshow.com/events"

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href={`/events/${params.id}`} className="flex items-center text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Event Details
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Get Tickets</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {event.title} - {formattedDate}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Options</CardTitle>
                <CardDescription>Select the ticket type that suits you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="font-medium">Regular Admission</h3>
                    <p className="text-sm text-muted-foreground">Standard entry to the event</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{event.price.toFixed(2)}</div>
                    <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-2 gradient-bg">
                        Buy Ticket
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="font-medium">VIP Package</h3>
                    <p className="text-sm text-muted-foreground">Premium access with exclusive perks</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{(event.price * 2).toFixed(2)}</div>
                    <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-2 gradient-bg">
                        Buy Ticket
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h3 className="font-medium">Family Pack</h3>
                    <p className="text-sm text-muted-foreground">Admission for 4 people at a discounted rate</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{(event.price * 3.5).toFixed(2)}</div>
                    <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="mt-2 gradient-bg">
                        Buy Ticket
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your ticket selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Regular Admission x 1</span>
                    <span>₹{event.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>₹{(event.price * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{(event.price * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Link href={bookingUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full gradient-bg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Tickets Now
                  </Button>
                </Link>
                <div className="flex justify-between w-full text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Ticket className="mr-1 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
