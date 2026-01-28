import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MoreVertical, Filter, Search, Plus } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/layout/BottomNav";

type BookingType = "doctor" | "medicine" | "lab" | "nurse" | "home-visit" | "elderly-care" | "emergency";
type BookingStatus = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  booking_type: BookingType;
  title: string;
  provider_name: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  amount: number;
  location: string | null;
}

const getTypeIcon = (type: BookingType) => {
  const icons: Record<BookingType, string> = {
    doctor: "🩺",
    medicine: "💊",
    lab: "🧪",
    nurse: "👩‍⚕️",
    "home-visit": "🏠",
    "elderly-care": "👴",
    emergency: "🚑",
  };
  return icons[type];
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "upcoming":
      return "bg-primary/10 text-primary border-primary/20";
    case "completed":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20";
  }
};

const BookingCard = ({ booking, onCancel, onRebook }: {
  booking: Booking;
  onCancel: (id: string) => void;
  onRebook: (type: BookingType) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl shrink-0 border border-primary/20">
                {getTypeIcon(booking.booking_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground">{booking.title}</h3>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{booking.provider_name}</p>
                
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.booking_time}
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
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onCancel(booking.id)}
                    >
                      Cancel Booking
                    </DropdownMenuItem>
                  </>
                )}
                {booking.status === "completed" && (
                  <>
                    <DropdownMenuItem onClick={() => onRebook(booking.booking_type)}>
                      Book Again
                    </DropdownMenuItem>
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
              <Button size="sm" variant="ghost" className="h-8" onClick={() => onRebook(booking.booking_type)}>
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } else if (data) {
      const typedBookings: Booking[] = data.map((b) => ({
        ...b,
        booking_type: b.booking_type as BookingType,
        status: b.status as BookingStatus,
      }));
      setBookings(typedBookings);
    }
    setLoading(false);
  };

  const handleCancel = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      });
      fetchBookings();
    }
  };

  const handleRebook = (type: BookingType) => {
    const routes: Record<BookingType, string> = {
      doctor: "/doctor-appointment",
      medicine: "/medicine-delivery",
      lab: "/lab-tests",
      nurse: "/part-time-nurse",
      "home-visit": "/doctor-home-visit",
      "elderly-care": "/elderly-care",
      emergency: "/emergency-sos",
    };
    navigate(routes[type]);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.provider_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && booking.status === activeTab;
  });

  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

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
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-xl bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                          <div className="h-3 bg-muted rounded w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancel={handleCancel}
                  onRebook={handleRebook}
                />
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
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "Your bookings will appear here"}
                </p>
                <Button onClick={() => navigate("/")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Book a Service
                </Button>
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
