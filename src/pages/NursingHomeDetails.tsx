import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Phone, Clock, Users, Award, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface PatientBooking {
  id: string;
  patient_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
  service_type: string;
  phone?: string;
  notes?: string;
}

interface NursingHome {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  distance: string;
  phone?: string;
  hours?: string;
  doctors?: number;
  beds?: number;
  specialties?: string[];
  bookings?: PatientBooking[];
}

const NursingHomeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
  const [bookings, setBookings] = useState<PatientBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock nursing homes data
  const nursingHomesData: Record<string, NursingHome> = {
    "1": {
      id: "1",
      name: "Care Plus Nursing Home",
      address: "Sector 18, Noida",
      rating: 4.8,
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
      phone: "+91 120 123 4567",
      hours: "24/7 Open",
      doctors: 12,
      beds: 45,
      specialties: ["Cardiology", "Orthopedics", "General Medicine", "Surgery"],
    },
    "5": {
      id: "5",
      name: "Apollo Health Center Mumbai",
      address: "Bandra, Mumbai",
      rating: 4.9,
      distance: "2.1 km",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
      phone: "+91 22 123 4567",
      hours: "24/7 Open",
      doctors: 20,
      beds: 60,
      specialties: ["Cardiology", "Neurology", "Oncology", "Pediatrics"],
    },
    "9": {
      id: "9",
      name: "Narayana Health Bangalore",
      address: "Whitefield, Bangalore",
      rating: 4.9,
      distance: "1.8 km",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
      phone: "+91 80 123 4567",
      hours: "24/7 Open",
      doctors: 25,
      beds: 80,
      specialties: ["Cardiology", "Urology", "Gastroenterology", "ENT"],
    },
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load nursing home data
      if (id && nursingHomesData[id]) {
        setNursingHome(nursingHomesData[id]);
      }

      // Fetch patient bookings for this nursing home
      if (id && user) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("location", nursingHomesData[id]?.address)
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false });

        if (error) {
          console.error("Error fetching bookings:", error);
        } else if (data) {
          const formattedBookings: PatientBooking[] = data.map((b) => ({
            id: b.id,
            patient_name: user.user_metadata?.full_name || "You",
            booking_date: b.booking_date,
            booking_time: b.booking_time,
            status: b.status,
            service_type: b.booking_type,
            phone: user.phone,
            notes: b.notes,
          }));
          setBookings(formattedBookings);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 space-y-4">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!nursingHome) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 text-center py-12">
          <p className="text-muted-foreground">Nursing home not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">Back Home</Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="pb-20">
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={nursingHome.image}
            alt={nursingHome.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white"
              onClick={() => toast.success("Share link copied!")}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Header Info */}
        <motion.section
          className="px-4 pt-6 pb-4 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">{nursingHome.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <span className="font-semibold text-foreground">{nursingHome.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">(425 reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{nursingHome.address}</span>
          </div>
        </motion.section>

        {/* Quick Info */}
        <section className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center space-y-2">
                <Clock className="w-5 h-5 text-primary mx-auto" />
                <div className="text-xs font-medium text-foreground">Hours</div>
                <div className="text-xs text-muted-foreground">{nursingHome.hours}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center space-y-2">
                <Users className="w-5 h-5 text-primary mx-auto" />
                <div className="text-xs font-medium text-foreground">Doctors</div>
                <div className="text-xs text-muted-foreground">{nursingHome.doctors}+</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center space-y-2">
                <Award className="w-5 h-5 text-primary mx-auto" />
                <div className="text-xs font-medium text-foreground">Beds</div>
                <div className="text-xs text-muted-foreground">{nursingHome.beds}+</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="specialties" className="w-full">
          <TabsList className="w-full justify-start px-4 bg-transparent border-b border-border/50 rounded-none h-auto p-0">
            <TabsTrigger value="specialties" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              Specialties
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              About
            </TabsTrigger>
          </TabsList>

          {/* Specialties Tab */}
          <TabsContent value="specialties" className="px-4 py-6 space-y-3">
            <h3 className="font-semibold text-foreground">Specialties Available</h3>
            <div className="flex flex-wrap gap-2">
              {nursingHome.specialties?.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {specialty}
                </Badge>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="px-4 py-6 space-y-4">
            <h3 className="font-semibold text-foreground">Your Bookings Here</h3>
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border/50 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{booking.patient_name}</h4>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Type:</strong> {booking.service_type}
                      </p>
                      <p>
                        <strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString("en-IN")} at {booking.booking_time}
                      </p>
                      {booking.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" />
                          {booking.phone}
                        </p>
                      )}
                      {booking.notes && (
                        <p>
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No bookings at this facility yet</p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="px-4 py-6 space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.location.href = `tel:${nursingHome.phone}`}>
                    <Phone className="w-4 h-4" />
                    {nursingHome.phone}
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Address</h4>
                  <p className="text-sm text-muted-foreground">{nursingHome.address}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Buttons */}
        <section className="px-4 py-6 space-y-3">
          <Button className="w-full bg-gradient-primary h-12 gap-2" onClick={() => navigate("/doctor-appointment")}>
            <Users className="w-4 h-4" />
            Book Appointment
          </Button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default NursingHomeDetails;
