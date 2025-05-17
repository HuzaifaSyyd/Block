import mongoose from "mongoose"

// Define the Garage schema
const garageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Garage", "Parts", "Travel"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [5, "Location must be at least 5 characters"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    openHours: {
      type: String,
      default: "Mon-Fri: 9am-6pm, Sat: 10am-4pm",
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create the model if it doesn't exist
export const Garage = mongoose.models.Garage || mongoose.model("Garage", garageSchema)

export default Garage
