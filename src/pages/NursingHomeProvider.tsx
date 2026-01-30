import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Users, TrendingUp, Search, Filter, MessageCircle, Eye, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface PatientBooking {
  id: string;
  patient_name: string;
  patient_email?: string;
  patient_phone?: string;
  booking_date: string;
  booking_time: string;
  status: string;
  service_type: string;
  doctor_name: string;
  notes?: string;
  medical_history?: string;
  amount: number;
}

const NursingHomeProvider = () => {
  const navigate = useNavigate();
  const { user, serviceType } = useAuth();
  const [bookings, setBookings] = useState<PatientBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Only allow nursing home providers
  if (serviceType !== "nursing_home") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Access Restricted</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                This page is only available for nursing home providers. Your current role: <span className="font-medium">{serviceType || "Not set"}</span>
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

  // Mock patient bookings data
  const mockBookings: PatientBooking[] = [
    {
      id: "1",
      patient_name: "Rahul Singh",
      patient_email: "rahul@example.com",
      patient_phone: "+91 98765 43210",
      booking_date: "2024-01-30",
      booking_time: "10:00",
      status: "upcoming",
      service_type: "Cardiology Consultation",
      doctor_name: "Dr. Rajesh Kumar",
      notes: "Routine check-up for hypertension",
      medical_history: "History: Hypertension (5 years), Diabetes (controlled)",
      amount: 500,
    },
    {
      id: "2",
      patient_name: "Priya Patel",
      patient_email: "priya@example.com",
      patient_phone: "+91 97654 32109",
      booking_date: "2024-02-02",
      booking_time: "14:30",
      status: "upcoming",
      service_type: "General Medicine",
      doctor_name: "Dr. Priya Sharma",
      notes: "Fever and cough consultation",
      medical_history: "Allergies: Penicillin, Dust. Medications: Allergy tablets",
      amount: 400,
    },
    {
      id: "3",
      patient_name: "Arjun Kumar",
      patient_email: "arjun@example.com",
      patient_phone: "+91 96543 21098",
      booking_date: "2024-01-28",
      booking_time: "11:00",
      status: "completed",
      service_type: "Orthopedic Consultation",
      doctor_name: "Dr. Amit Patel",
      notes: "Follow-up for knee injury",
      medical_history: "Knee injury (fracture healed), Physio ongoing",
      amount: 450,
    },
    {
      id: "4",
      patient_name: "Meera Desai",
      patient_email: "meera@example.com",
      patient_phone: "+91 95432 10987",
      booking_date: "2024-02-05",
      booking_time: "09:30",
      status: "upcoming",
      service_type: "General Check-up",
      doctor_name: "Dr. Priya Sharma",
      notes: "Pre-surgery medical clearance",
      medical_history: "Previous Surgery: Appendix removal (2022). BP: Normal",
      amount: 300,
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    // Simulate fetching bookings from database
    // In production, this would filter by nursing home ID
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && booking.status === activeTab;
  });

  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const BookingCard = ({ booking }: { booking: PatientBooking }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <CardContent className="p-4 space-y-4">
        {/* Patient Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{booking.patient_name}</h3>
              <Badge variant="outline" className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{booking.doctor_name}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary">₹{booking.amount}</div>
            <div className="text-xs text-muted-foreground">{booking.service_type}</div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(booking.booking_date).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{booking.booking_time}</span>
          </div>
        </div>

        {/* Medical History Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <h4 className="font-medium text-sm text-foreground mb-2">Medical History</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {booking.medical_history}
          </p>
        </div>

        {/* Notes Section */}
        {booking.notes && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
            <h4 className="font-medium text-sm text-foreground mb-2">Visit Notes</h4>
            <p className="text-xs text-muted-foreground">{booking.notes}</p>
          </div>
        )}

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
            onClick={() => toast.info("Messaging coming soon!")}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Message
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => toast.info("Detailed medical history coming soon!")}
          >
            <Eye className="w-3.5 h-3.5" />
            Details
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
              <h1 className="text-lg font-semibold text-foreground">Patient Appointments</h1>
              <p className="text-xs text-muted-foreground">
                {upcomingCount} upcoming · {completedCount} completed
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or doctor..."
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
            <div className="text-xs text-muted-foreground mt-1">Total Appointments</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-card border border-border/50 text-center"
          >
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">₹{bookings.reduce((sum, b) => sum + b.amount, 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">Revenue</div>
          </motion.div>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs py-2">Upcoming</TabsTrigger>
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
                <h3 className="font-medium text-foreground mb-1">No appointments found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "No appointments scheduled yet"}
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

export default NursingHomeProvider;
