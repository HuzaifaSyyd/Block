import EventCard from "./event-card"
import { getEvents } from "@/lib/data"

export default async function EventList() {
  const events = await getEvents()

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No events found</h3>
        <p className="text-muted-foreground mt-2">Check back later for upcoming events.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  )
}
