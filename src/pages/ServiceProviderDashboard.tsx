import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, Ambulance, Package, Plus, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast.success("Logged out successfully");
  };

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
        <section className="px-4 mb-8">
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

        {/* Register Services */}
        <section className="px-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Register Your Services
          </h2>
          <div className="space-y-3">
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
          </div>
        </section>

        {/* Help Section */}
        <section className="px-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Get Help
          </h2>
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
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default ServiceProviderDashboard;
