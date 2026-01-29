import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, Ambulance, Package, Plus, Bell, Star, MapPin, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  rating: number;
  consultationFee: number;
  image: string;
  nursingHome: string;
  languages: string[];
}

interface NursingHome {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image: string;
  doctors: number;
  beds: number;
  phone: string;
}

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isServiceProvider } = useUserRole();

  // Redirect if not a service provider
  if (!isServiceProvider) {
    navigate("/");
    return null;
  }

  const mockDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      qualification: "MD (Cardiology)",
      rating: 4.8,
      consultationFee: 500,
      image: "https://images.unsplash.com/photo-1612349317453-3ad32c4a3a9d?w=400&h=400&fit=crop",
      nursingHome: "Care Plus Nursing Home",
      languages: ["English", "Hindi"],
    },
    {
      id: "2",
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      qualification: "MBBS, MD",
      rating: 4.7,
      consultationFee: 400,
      image: "https://images.unsplash.com/photo-1594824476967-48c12f4050d1?w=400&h=400&fit=crop",
      nursingHome: "Wellness Medical Center",
      languages: ["English", "Hindi"],
    },
    {
      id: "3",
      name: "Dr. Amit Patel",
      specialty: "Orthopedics",
      qualification: "MS (Orthopedics)",
      rating: 4.6,
      consultationFee: 450,
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=400&fit=crop",
      nursingHome: "Medanta Nursing Home",
      languages: ["English", "Gujarati"],
    },
  ];

  const mockNursingHomes: NursingHome[] = [
    {
      id: "1",
      name: "Care Plus Nursing Home",
      address: "Sector 18, Noida",
      rating: 4.8,
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
      doctors: 12,
      beds: 45,
      phone: "+91 120 123 4567",
    },
    {
      id: "5",
      name: "Apollo Health Center Mumbai",
      address: "Bandra, Mumbai",
      rating: 4.9,
      distance: "2.1 km",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
      doctors: 20,
      beds: 60,
      phone: "+91 22 123 4567",
    },
    {
      id: "9",
      name: "Narayana Health Bangalore",
      address: "Whitefield, Bangalore",
      rating: 4.9,
      distance: "1.8 km",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
      doctors: 25,
      beds: 80,
      phone: "+91 80 123 4567",
    },
  ];

  const services: ServiceOption[] = [
    {
      id: "nursing-home",
      title: "Nursing Home",
      description: "Register and manage your nursing home facility",
      icon: <Building2 className="w-6 h-6" />,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Register and manage your doctor profile",
      icon: <Users className="w-6 h-6" />,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      id: "ambulance",
      title: "Ambulance Service",
      description: "Register your ambulance service",
      icon: <Ambulance className="w-6 h-6" />,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      id: "delivery",
      title: "Delivery Partner",
      description: "Register as medicine/delivery partner",
      icon: <Package className="w-6 h-6" />,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/doctor/${doctor.id}`)}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all text-left group"
    >
      <div className="flex gap-3 p-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs text-primary font-medium">{doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-xs font-semibold text-foreground">{doctor.rating}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">₹{doctor.consultationFee}</p>
        </div>
      </div>
    </motion.button>
  );

  const NursingHomeCard = ({ home }: { home: NursingHome }) => (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/nursing-home/${home.id}`)}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all text-left group"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={home.image}
          alt={home.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {home.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{home.address}</p>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-xs font-semibold text-foreground">{home.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">{home.doctors} doctors</span>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        {/* Welcome Section */}
        <motion.section
          className="px-4 pt-6 pb-4 bg-gradient-to-r from-primary/10 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome, {user?.user_metadata?.full_name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Manage your healthcare services
          </p>
        </motion.section>

        {/* Quick Stats */}
        <section className="px-4 mb-6 mt-4">
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center"
            >
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground mt-1">Services</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center"
            >
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground mt-1">Bookings</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center"
            >
              <div className="text-2xl font-bold text-primary">₹0</div>
              <div className="text-xs text-muted-foreground mt-1">Earnings</div>
            </motion.div>
          </div>
        </section>

        {/* Tabs for Providers and Services */}
        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="w-full justify-start px-4 bg-transparent border-b border-border/50 rounded-none h-auto p-0">
            <TabsTrigger value="providers" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              All Providers
            </TabsTrigger>
            <TabsTrigger value="myServices" className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary">
              My Services
            </TabsTrigger>
          </TabsList>

          {/* Providers Tab */}
          <TabsContent value="providers" className="px-4 py-6 space-y-6">
            {/* Doctors Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Available Doctors
              </h2>
              <div className="space-y-3">
                {mockDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DoctorCard doctor={doctor} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Nursing Homes Section */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Available Nursing Homes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockNursingHomes.map((home, index) => (
                  <motion.div
                    key={home.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NursingHomeCard home={home} />
                  </motion.div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* My Services Tab */}
          <TabsContent value="myServices" className="px-4 py-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">Register Your Services</h3>
            {services.map((service, index) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  toast.info(`${service.title} registration coming soon!`);
                }}
                className="w-full flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-md transition-all text-left group"
              >
                <div className={`${service.bgColor} p-3 rounded-lg ${service.color} flex-shrink-0`}>
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {service.description}
                  </p>
                </div>
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
              </motion.button>
            ))}

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Get Help</h3>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                onClick={() => {
                  toast.info("Support contact coming soon!");
                }}
              >
                <Bell className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="font-medium text-foreground">Need assistance?</div>
                  <div className="text-xs text-muted-foreground">
                    Contact our support team
                  </div>
                </div>
              </motion.button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default ServiceProviderDashboard;
