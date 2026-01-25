import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MoreVertical, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BottomNav from "@/components/layout/BottomNav";

interface Booking {
  id: string;
  type: "doctor" | "medicine" | "lab" | "nurse" | "home-visit" | "elderly-care";
  title: string;
  provider: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  amount: number;
  location?: string;
  image?: string;
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    type: "doctor",
    title: "Doctor Appointment",
    provider: "Dr. Priya Sharma",
    date: "2024-01-28",
    time: "10:00 AM",
    status: "upcoming",
    amount: 500,
    location: "Apollo Clinic, Koramangala",
  },
  {
    id: "BK002",
    type: "lab",
    title: "Lab Test - CBC",
    provider: "Thyrocare Labs",
    date: "2024-01-30",
    time: "07:00 AM",
    status: "upcoming",
    amount: 450,
    location: "Home Collection",
  },
  {
    id: "BK003",
    type: "nurse",
    title: "Part-time Nurse",
    provider: "Nurse Anjali",
    date: "2024-01-25",
    time: "09:00 AM - 01:00 PM",
    status: "completed",
    amount: 800,
    location: "Home Visit",
  },
  {
    id: "BK004",
    type: "medicine",
    title: "Medicine Delivery",
    provider: "MedPlus Pharmacy",
    date: "2024-01-24",
    time: "02:30 PM",
    status: "completed",
    amount: 1250,
  },
  {
    id: "BK005",
    type: "home-visit",
    title: "Doctor Home Visit",
    provider: "Dr. Rajesh Kumar",
    date: "2024-01-20",
    time: "11:00 AM",
    status: "completed",
    amount: 799,
    location: "Home Visit",
  },
  {
    id: "BK006",
    type: "elderly-care",
    title: "Elderly Care - Daily",
    provider: "Caregiver Meera",
    date: "2024-01-18",
    time: "08:00 AM - 08:00 PM",
    status: "cancelled",
    amount: 1499,
    location: "Home Care",
  },
];

const getTypeIcon = (type: Booking["type"]) => {
  const icons: Record<Booking["type"], string> = {
    doctor: "🩺",
    medicine: "💊",
    lab: "🧪",
    nurse: "👩‍⚕️",
    "home-visit": "🏠",
    "elderly-care": "👴",
  };
  return icons[type];
};

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "upcoming":
      return "bg-primary/10 text-primary border-primary/20";
    case "completed":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
  }
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const navigate = useNavigate();

  const handleRebook = () => {
    const routes: Record<Booking["type"], string> = {
      doctor: "/doctor-appointment",
      medicine: "/medicine-delivery",
      lab: "/lab-tests",
      nurse: "/part-time-nurse",
      "home-visit": "/doctor-home-visit",
      "elderly-care": "/elderly-care",
    };
    navigate(routes[booking.type]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-2xl shrink-0">
                {getTypeIcon(booking.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground">{booking.title}</h3>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{booking.provider}</p>
                
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.time}
                  </span>
                  {booking.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                {booking.status === "upcoming" && (
                  <>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                  </>
                )}
                {booking.status === "completed" && (
                  <>
                    <DropdownMenuItem onClick={handleRebook}>Book Again</DropdownMenuItem>
                    <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <span className="text-sm font-medium text-foreground">₹{booking.amount}</span>
            {booking.status === "upcoming" && (
              <Button size="sm" variant="outline" className="h-8 gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Contact
              </Button>
            )}
            {booking.status === "completed" && (
              <Button size="sm" variant="ghost" className="h-8" onClick={handleRebook}>
                Book Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BookingHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && booking.status === activeTab;
  });

  const upcomingCount = mockBookings.filter((b) => b.status === "upcoming").length;
  const completedCount = mockBookings.filter((b) => b.status === "completed").length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 glass border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container flex items-center gap-3 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">My Bookings</h1>
            <p className="text-xs text-muted-foreground">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      <main className="container py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 h-auto p-1">
            <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs py-2">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2">Completed</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs py-2">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">No bookings found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "Your bookings will appear here"}
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

export default BookingHistory;
