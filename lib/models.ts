export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
}

export interface Garage {
  _id: string
  name: string
  description: string
  category: "Garage" | "Parts" | "Travel"
  location: string
  rating: number
  reviewCount: number
  availability: boolean
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  _id: string
  title: string
  description: string
  date: Date
  location: string
  price: number
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id: string
  content: string
  user: {
    id: string
    name: string
    image?: string
  }
  likes: number
  createdAt: Date
}
