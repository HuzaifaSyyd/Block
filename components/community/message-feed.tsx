import MessageItem from "./message-item"
import { getMessages } from "@/lib/data"

export default async function MessageFeed() {
  const messages = await getMessages()

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No messages yet. Be the first to start a conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}
    </div>
  )
}
