import { Suspense } from "react"
import EventList from "@/components/events/event-list"
import EventListSkeleton from "@/components/events/event-list-skeleton"
import EventHero from "@/components/events/event-hero"
import AddEventButton from "@/components/events/add-event-button"

export default function EventsPage() {
  return (
    <div>
      <EventHero />

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <AddEventButton />
        </div>

        <Suspense fallback={<EventListSkeleton />}>
          <EventList />
        </Suspense>
      </div>
    </div>
  )
}
