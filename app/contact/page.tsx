import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions or feedback? We'd love to hear from you. Reach out to us using any of the methods below.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="h-6 w-6 mr-4 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">info@blockpiston.com</p>
                <p className="text-muted-foreground">support@blockpiston.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 mr-4 text-primary" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-6 w-6 mr-4 text-primary" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">
                  123 Gear Street
                  <br />
                  Automotive District
                  <br />
                  Engine City, EC 12345
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 mr-4 text-primary" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9am - 5pm</p>
                <p className="text-muted-foreground">Saturday: 10am - 2pm</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map would be embedded here</p>
          </div>
          <p className="mt-4 text-muted-foreground">
            Our headquarters is located in the heart of Engine City, easily accessible by public transportation and with
            ample parking available.
          </p>
        </div>
      </div>
    </div>
  )
}
