import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, Ambulance, Package, Plus, Bell, TrendingUp, Calendar, DollarSign, AlertCircle, UserCheck, FileText, Settings, Zap, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  status: string;
  amount: number;
}

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  requirements: string[];
}

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, serviceType } = useAuth();
  const { isServiceProvider } = useUserRole();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  // Handle redirects in useEffect to avoid setState in render
  useEffect(() => {
    if (!isServiceProvider) {
      navigate("/");
    } else if (!serviceType) {
      navigate("/signup");
    }
  }, [isServiceProvider, serviceType, navigate]);

  // Fetch appointments and calculate earnings
  useEffect(() => {
    fetchAppointmentsData();
  }, [serviceType]);

  // Prevent rendering while redirecting
  if (!isServiceProvider || !serviceType) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleNavigateToPage = (path: string) => {
    navigate(path);
  };

  // Map serviceType to service configuration
  const serviceMap: Record<string, ServiceOption> = {
    "nursing_home": {
      id: "nursing-home",
      title: "Nursing Home",
      description: "Register and manage your nursing home facility",
      icon: <Building2 className="w-8 h-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      requirements: ["Registration document", "License", "Staff details"],
    },
    "doctor": {
      id: "doctor",
      title: "Doctor",
      description: "Register and manage your doctor profile",
      icon: <Users className="w-8 h-8" />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      requirements: ["Medical degree", "License", "Specialization"],
    },
    "nurse_caretaker": {
      id: "nurse-caretaker",
      title: "Nurse Caretaker",
      description: "Register and manage your caretaking services",
      icon: <UserCheck className="w-8 h-8" />,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      requirements: ["Nursing certificate", "Experience", "Health check"],
    },
    "ambulance": {
      id: "ambulance",
      title: "Ambulance Service",
      description: "Register your ambulance service",
      icon: <Ambulance className="w-8 h-8" />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      requirements: ["Vehicle details", "Driver license", "Insurance"],
    },
    "delivery": {
      id: "delivery",
      title: "Delivery Partner",
      description: "Register as medicine/delivery partner",
      icon: <Package className="w-8 h-8" />,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      requirements: ["Identity proof", "Transport", "Banking details"],
    },
  };

  const currentService = serviceMap[serviceType];
  const services = currentService ? [currentService] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        {/* Welcome Section */}
        <motion.section
          className="px-4 pt-6 pb-6 bg-gradient-to-r from-primary/10 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Welcome, {user?.user_metadata?.full_name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Service Provider Dashboard
            </p>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <section className="px-4 mb-8">
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center"
            >
              <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground mt-1">Services</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center"
            >
              <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground mt-1">Bookings</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-card border border-border/50 text-center"
            >
              <DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">₹0</div>
              <div className="text-xs text-muted-foreground mt-1">Earnings</div>
            </motion.div>
          </div>
        </section>

        {/* Service Type Notice */}
        <section className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Registered Service Type</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You are registered as: <span className="text-primary font-semibold">{currentService?.title}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Your service type cannot be changed. If you need to offer a different service, please create a new account.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Quick Actions Section */}
        <section className="px-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            {/* Appointments/Bookings */}
            {(serviceType === "doctor" || serviceType === "nurse_caretaker" || serviceType === "nursing_home") && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                onClick={() => {
                  if (serviceType === "doctor") navigate("/doctor-provider");
                  else if (serviceType === "nurse_caretaker") navigate("/nurse-provider");
                  else if (serviceType === "nursing_home") navigate("/nursing-home-provider");
                }}
                className="w-full bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-blue-500/30 transition-all overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-blue-500 flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">
                      {serviceType === "nursing_home" ? "Patient Appointments" : "My Appointments"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {serviceType === "nursing_home"
                        ? "Manage patient bookings and schedules"
                        : "View and manage your appointments"}
                    </p>
                  </div>
                </div>
              </motion.button>
            )}

            {/* Order Bookings for Ambulance/Delivery */}
            {(serviceType === "ambulance" || serviceType === "delivery") && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                onClick={() => {
                  if (serviceType === "ambulance") navigate("/ambulance-provider");
                  else navigate("/delivery-provider");
                }}
                className="w-full bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-blue-500/30 transition-all overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-blue-500 flex-shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">
                      {serviceType === "ambulance" ? "Booking Requests" : "Delivery Orders"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {serviceType === "ambulance"
                        ? "View and manage ambulance bookings"
                        : "View and manage delivery orders"}
                    </p>
                  </div>
                </div>
              </motion.button>
            )}

            {/* Community Connection - For All Service Types */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/provider-community")}
              className="w-full bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-cyan-500/30 transition-all overflow-hidden"
            >
              <div className="flex items-start gap-4 p-4">
                <div className="bg-cyan-50 dark:bg-cyan-950 p-4 rounded-lg text-cyan-500 flex-shrink-0">
                  <Network className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">Community Network</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect with other {currentService?.title.toLowerCase()} providers
                  </p>
                </div>
                <div className="flex items-center justify-center bg-cyan-100 dark:bg-cyan-900 rounded-lg px-3 py-1 flex-shrink-0">
                  <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">3</span>
                </div>
              </div>
            </motion.button>

            {/* Registration Credentials */}
            {(serviceType === "doctor" || serviceType === "nurse_caretaker") && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => {
                  if (serviceType === "doctor") navigate("/doctor-registration");
                  else navigate("/nurse-registration");
                }}
                className="w-full bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-green-500/30 transition-all overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-green-500 flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">
                      {serviceType === "doctor" ? "Medical Credentials" : "Nursing Credentials"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit registration, degrees, and certifications
                    </p>
                  </div>
                </div>
              </motion.button>
            )}

            {/* Pricing Settings for Doctor/Nurse */}
            {(serviceType === "doctor" || serviceType === "nurse_caretaker") && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => navigate("/pricing-settings")}
                className="w-full bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-orange-500/30 transition-all overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg text-orange-500 flex-shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Pricing Settings</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your service rates and offers
                    </p>
                  </div>
                </div>
              </motion.button>
            )}

            {/* Ads Page for Doctor/Nursing Home */}
            {(serviceType === "doctor" || serviceType === "nursing_home") && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate("/provider-ads")}
                className="w-full bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-purple-500/30 transition-all overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg text-purple-500 flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">Ad Campaigns</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Run ads and reach more patients for rupees
                    </p>
                  </div>
                </div>
              </motion.button>
            )}
          </div>
        </section>

        {/* Support Section */}
        <section className="px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Need Assistance?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Our support team is available 24/7 to help you register and grow your business
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast.info("Support contact coming soon!")}
            >
              Contact Support
            </Button>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default ServiceProviderDashboard;
