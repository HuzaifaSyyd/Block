import { Suspense } from "react"
import MessageInput from "@/components/community/message-input"
import MessageFeed from "@/components/community/message-feed"
import MessageFeedSkeleton from "@/components/community/message-feed-skeleton"

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 gradient-text">Community</h1>

      <div className="max-w-3xl mx-auto flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Messages</h2>
          <Suspense fallback={<MessageFeedSkeleton />}>
            <MessageFeed />
          </Suspense>
        </div>

        <div className="sticky bottom-4 z-10">
          <MessageInput />
        </div>
      </div>
    </div>
  )
}
