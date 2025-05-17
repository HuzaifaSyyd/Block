import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getGarageById } from "@/lib/data"
import { Star, MapPin, Phone, Mail, ArrowLeft, Clock } from "lucide-react"

interface GarageDetailsPageProps {
  params: { id: string }
}

export default async function GarageDetailsPage({ params }: GarageDetailsPageProps) {
  const garage = await getGarageById(params.id)

  if (!garage) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/garage" className="flex items-center text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
            <Image
              src={garage.image || "/placeholder.svg?height=600&width=1200"}
              alt={garage.name}
              fill
              className="object-cover"
              priority
            />
            {garage.category === "Parts" && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-card">
                {garage.availability ? (
                  <span className="text-green-500">Available</span>
                ) : (
                  <span className="text-red-500">Unavailable</span>
                )}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{garage.name}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-500">
              <Star className="fill-current h-5 w-5" />
              <span className="ml-1 font-medium">{garage.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground ml-1">({garage.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{garage.location}</span>
            </div>

            <div className="px-2 py-1 rounded-full text-xs font-medium gradient-bg text-white">{garage.category}</div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <h2>About this {garage.category}</h2>
            <p>{garage.description}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed
              erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.
              Phasellus molestie magna non est bibendum non venenatis nisl tempor.
            </p>

            {garage.category === "Garage" && (
              <>
                <h2>Services Offered</h2>
                <ul>
                  <li>General Maintenance and Repairs</li>
                  <li>Performance Tuning</li>
                  <li>Custom Modifications</li>
                  <li>Diagnostic Services</li>
                  <li>Tire and Wheel Services</li>
                </ul>
              </>
            )}

            {garage.category === "Parts" && (
              <>
                <h2>Products Available</h2>
                <ul>
                  <li>OEM and Aftermarket Parts</li>
                  <li>Performance Upgrades</li>
                  <li>Accessories and Customization</li>
                  <li>Tools and Equipment</li>
                  <li>Fluids and Maintenance Items</li>
                </ul>
              </>
            )}

            {garage.category === "Travel" && (
              <>
                <h2>Travel Services</h2>
                <ul>
                  <li>Road Trip Planning</li>
                  <li>Automotive Tourism</li>
                  <li>Car Rental Services</li>
                  <li>Guided Tours</li>
                  <li>Adventure Packages</li>
                </ul>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg p-6 shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>

            <div className="space-y-4 mb-6">
              {garage.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary" />
                  <span>{garage.phone}</span>
                </div>
              )}
              {garage.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <span>{garage.email}</span>
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <span>{garage.location}</span>
              </div>
              {garage.category === "Garage" && garage.openHours && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{garage.openHours}</span>
                </div>
              )}
            </div>

            {garage.category === "Travel" && garage.mapUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Location Map</h3>
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <iframe
                    src={garage.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            )}

            <Button className="w-full gradient-bg mb-3">
              {garage.category === "Garage"
                ? "Book Appointment"
                : garage.category === "Parts"
                  ? "Contact Shop"
                  : "Book Travel"}
            </Button>
            <Button variant="outline" className="w-full">
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
