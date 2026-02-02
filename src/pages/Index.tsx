import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import EmergencyButton from "@/components/home/EmergencyButton";
import QuickActions from "@/components/home/QuickActions";
import ServicesGrid from "@/components/home/ServicesGrid";
import PromoCard from "@/components/home/PromoCard";
import TrustBadges from "@/components/home/TrustBadges";
import HealthTipsCard from "@/components/home/HealthTipsCard";
import FeaturedPlaces from "@/components/home/FeaturedPlaces";
import QuickStats from "@/components/home/QuickStats";
import { useUserRole } from "@/hooks/useUserRole";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { isServiceProvider } = useUserRole();

  // Redirect service providers to their dashboard
  useEffect(() => {
    if (isServiceProvider) {
      navigate("/service-provider-dashboard");
    }
  }, [isServiceProvider, navigate]);

  // Show loading or nothing while redirecting
  if (isServiceProvider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Welcome Section */}
        <motion.section 
          className="px-4 pt-6 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Good Morning! 👋
          </h1>
          <p className="text-muted-foreground">
            How can we help you today?
          </p>
        </motion.section>
        
        {/* Quick Stats */}
        <QuickStats />
        
        {/* Emergency SOS Button */}
        <EmergencyButton />
        
        {/* Quick Actions Row */}
        <QuickActions />
        
        {/* Promo Banner */}
        <PromoCard />
        
        {/* Services Grid */}
        <ServicesGrid />

        {/* Featured Places Across India */}
        <FeaturedPlaces />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Health Tips */}
        <HealthTipsCard />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
