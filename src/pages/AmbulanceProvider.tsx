import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Users, TrendingUp, Search, MessageCircle, AlertCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface BookingRequest {
  id: string;
  patient_name: string;
  patient_phone?: string;
  pickup_location: string;
  dropoff_location: string;
  booking_date: string;
  booking_time: string;
  status: string;
  urgency: "routine" | "urgent" | "emergency";
  distance?: string;
  amount: number;
}

const AmbulanceProvider = () => {
  const navigate = useNavigate();
  const { user, serviceType } = useAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Only allow ambulance providers
  if (serviceType !== "ambulance") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Access Restricted</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                This page is only available for ambulance service providers. Your current role: <span className="font-medium">{serviceType || "Not set"}</span>
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/service-provider-dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Mock booking data
  const mockBookings: BookingRequest[] = [
    {
      id: "1",
      patient_name: "Rajesh Kumar",
      patient_phone: "+91 98765 43210",
      pickup_location: "City Hospital, Bandra",
      dropoff_location: "Home, Worli",
      booking_date: "2024-01-30",
      booking_time: "10:00",
      status: "assigned",
      urgency: "routine",
      distance: "15 km",
      amount: 450,
    },
    {
      id: "2",
      patient_name: "Priya Patel",
      patient_phone: "+91 97654 32109",
      pickup_location: "Clinic, Andheri",
      dropoff_location: "Hospital, Dadar",
      booking_date: "2024-02-02",
      booking_time: "14:30",
      status: "completed",
      urgency: "urgent",
      distance: "12 km",
      amount: 650,
    },
    {
      id: "3",
      patient_name: "Emergency Case",
      patient_phone: "+91 96543 21098",
      pickup_location: "Accident Site, Eastern Express Highway",
      dropoff_location: "Trauma Center, Vile Parle",
      booking_date: "2024-01-28",
      booking_time: "23:45",
      status: "completed",
      urgency: "emergency",
      distance: "8 km",
      amount: 1200,
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pickup_location.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && booking.status === activeTab;
  });

  const assignedCount = bookings.filter((b) => b.status === "assigned").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      case "urgent":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400";
      case "routine":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
  };

  const BookingCard = ({ booking }: { booking: BookingRequest }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{booking.patient_name}</h3>
              <Badge variant="outline" className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge className={getUrgencyColor(booking.urgency)}>
                {booking.urgency.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary">₹{booking.amount}</div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-2 py-3 border-y border-border/50">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="text-foreground">{booking.pickup_location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Dropoff</p>
              <p className="text-foreground">{booking.dropoff_location}</p>
            </div>
          </div>
        </div>

        {/* Time & Distance */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(booking.booking_date).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{booking.booking_time}</span>
          </div>
          {booking.distance && (
            <div className="text-muted-foreground text-center">
              {booking.distance}
            </div>
          )}
        </div>

        {/* Contact & Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => {
              if (booking.patient_phone) {
                window.location.href = `tel:${booking.patient_phone}`;
              }
            }}
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => toast.info("GPS navigation coming soon!")}
          >
            <MapPin className="w-3.5 h-3.5" />
            Navigate
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Header Section */}
      <motion.header
        className="sticky top-0 z-40 glass border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/service-provider-dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Booking Requests</h1>
              <p className="text-xs text-muted-foreground">
                {assignedCount} assigned · {completedCount} completed
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/ambulance-settings")}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>
      </motion.header>

      <main className="container px-4 py-6 space-y-4">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-card border border-border/50 text-center"
          >
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{bookings.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Bookings</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-card border border-border/50 text-center"
          >
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">₹{bookings.reduce((sum, b) => sum + b.amount, 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">Earnings</div>
          </motion.div>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
            <TabsTrigger value="assigned" className="text-xs py-2">Active</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex gap-3 animate-pulse">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">No bookings found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "No booking requests yet"}
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default AmbulanceProvider;
