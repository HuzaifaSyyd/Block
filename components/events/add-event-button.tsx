"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddEventForm from "./add-event-form"

export default function AddEventButton() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const isAdmin = session?.user && (session.user as any).role === "admin"

  if (!isAdmin) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <AddEventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
