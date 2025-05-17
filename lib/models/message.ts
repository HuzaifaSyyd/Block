import mongoose from "mongoose"

// Define the Message schema
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Message cannot be empty"],
    },
    mediaType: {
      type: String,
      enum: ["none", "image", "video"],
      default: "none",
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    user: {
      id: {
        type: String,
        required: [true, "User ID is required"],
      },
      name: {
        type: String,
        required: [true, "User name is required"],
      },
      image: {
        type: String,
        default: null,
      },
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: [
      {
        type: String, // User IDs who liked this message
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create the model if it doesn't exist
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)

export default Message
