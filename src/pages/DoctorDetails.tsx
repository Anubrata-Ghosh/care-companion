import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Phone, Zap, Share2, Heart, Calendar, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  image: string;
  nursingHome: string;
  languages: string[];
  availability: string;
  bio?: string;
  phone?: string;
  address?: string;
}

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRunningAds, setIsRunningAds] = useState(false);

  // Mock doctors data
  const doctorsData: Record<string, Doctor> = {
    "1": {
      id: "1",
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      qualification: "MD (Cardiology)",
      experience: "12 years",
      rating: 4.8,
      reviewCount: 234,
      consultationFee: 500,
      image: "https://images.unsplash.com/photo-1612349317453-3ad32c4a3a9d?w=400&h=400&fit=crop",
      nursingHome: "Care Plus Nursing Home",
      languages: ["English", "Hindi"],
      availability: "Mon-Sat: 9:00 AM - 5:00 PM",
      bio: "Specialized in cardiovascular diseases with extensive experience in preventive cardiology and intervention procedures.",
      phone: "+91 98765 43210",
      address: "Sector 18, Noida",
    },
    "2": {
      id: "2",
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      qualification: "MBBS, MD (General Medicine)",
      experience: "8 years",
      rating: 4.7,
      reviewCount: 189,
      consultationFee: 400,
      image: "https://images.unsplash.com/photo-1594824476967-48c12f4050d1?w=400&h=400&fit=crop",
      nursingHome: "Wellness Medical Center",
      languages: ["English", "Hindi"],
      availability: "Mon-Sun: 10:00 AM - 6:00 PM",
      bio: "Compassionate physician dedicated to providing comprehensive primary care with focus on patient education.",
      phone: "+91 97654 32109",
      address: "Greater Kailash, Delhi",
    },
  };

  const doctor = doctorsData[id || "1"];

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 text-center py-12">
          <p className="text-muted-foreground">Doctor not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">Back Home</Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleRunAds = () => {
    setIsRunningAds(true);
    toast.success("Starting ad campaign...");
    
    // Simulate ad creation
    setTimeout(() => {
      setIsRunningAds(false);
      toast.success("Ad campaign is now live! 🎉");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="pb-20">
        {/* Hero Section */}
        <motion.section
          className="relative h-80 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="absolute top-4 right-4 flex gap-2">
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
        </motion.section>

        {/* Doctor Info */}
        <motion.section
          className="px-4 pt-6 pb-4 space-y-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
            <p className="text-primary font-medium">{doctor.specialty}</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="font-semibold text-foreground">{doctor.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">({doctor.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{doctor.nursingHome}</span>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <section className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center space-y-2">
                <BookOpen className="w-5 h-5 text-primary mx-auto" />
                <div className="text-xs font-medium text-foreground">Experience</div>
                <div className="text-xs text-muted-foreground">{doctor.experience}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center space-y-2">
                <Calendar className="w-5 h-5 text-primary mx-auto" />
                <div className="text-xs font-medium text-foreground">Consultation</div>
                <div className="text-xs text-muted-foreground">₹{doctor.consultationFee}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center space-y-2">
                <MessageCircle className="w-5 h-5 text-primary mx-auto" />
                <div className="text-xs font-medium text-foreground">Languages</div>
                <div className="text-xs text-muted-foreground">{doctor.languages.join(", ")}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start px-4 bg-transparent border-b border-border/50 rounded-none h-auto p-0">
            <TabsTrigger value="about" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              About
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              Details
            </TabsTrigger>
            <TabsTrigger value="ads" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              Ads
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="px-4 py-6 space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground">About {doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.bio}</p>
                
                <div className="pt-4 space-y-3 border-t border-border/50">
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Qualifications</h4>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {doctor.qualification}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Availability</h4>
                    <p className="text-sm text-muted-foreground">{doctor.availability}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="px-4 py-6 space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Contact Information</h4>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    onClick={() => window.location.href = `tel:${doctor.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                    {doctor.phone}
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">{doctor.address}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads" className="px-4 py-6 space-y-4">
            <Card className="border-border/50 bg-primary/5 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Boost Your Visibility</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Run ads to reach more patients and increase your bookings
                    </p>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-black/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-foreground text-sm">Ad Package Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Featured placement in search results</li>
                    <li>✓ Highlighted profile badge</li>
                    <li>✓ Priority in recommendations</li>
                    <li>✓ Targeted reach to patients</li>
                    <li>✓ Analytics dashboard</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="border border-border/50 rounded-lg p-3 text-center">
                    <div className="font-semibold text-foreground">₹499</div>
                    <div className="text-xs text-muted-foreground">7 Days</div>
                  </div>
                  <div className="border border-border/50 rounded-lg p-3 text-center bg-primary/10 border-primary/20">
                    <div className="font-semibold text-primary">₹899</div>
                    <div className="text-xs text-primary/70">30 Days</div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 gap-2"
                  onClick={handleRunAds}
                  disabled={isRunningAds}
                >
                  <Zap className="w-4 h-4" />
                  {isRunningAds ? "Starting Ad Campaign..." : "Run Ads Now"}
                </Button>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Reach hundreds of patients looking for your services
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Buttons */}
        <section className="px-4 py-6 space-y-3">
          <Button className="w-full bg-gradient-primary h-12 gap-2" onClick={() => navigate("/doctor-appointment")}>
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Button>
          <Button variant="outline" className="w-full h-12 gap-2">
            <MessageCircle className="w-4 h-4" />
            Message Doctor
          </Button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default DoctorDetails;
