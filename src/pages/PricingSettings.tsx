import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface ServicePrice {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  discount?: number;
}

const PricingSettings = () => {
  const navigate = useNavigate();
  const { serviceType, user } = useAuth();
  const [activeTab, setActiveTab] = useState("consultation");
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if user is doctor or nurse
  const isDoctor = serviceType === "doctor";
  const isNurse = serviceType === "nurse_caretaker";

  const [doctorPricing, setDoctorPricing] = useState<ServicePrice[]>([
    {
      id: "1",
      name: "General Consultation",
      description: "30-minute general consultation",
      basePrice: 500,
      discount: 0,
    },
    {
      id: "2",
      name: "Follow-up Consultation",
      description: "15-minute follow-up session",
      basePrice: 300,
      discount: 0,
    },
    {
      id: "3",
      name: "Video Consultation",
      description: "Online consultation via video",
      basePrice: 400,
      discount: 0,
    },
    {
      id: "4",
      name: "Home Visit",
      description: "In-home consultation",
      basePrice: 1000,
      discount: 0,
    },
  ]);

  const [nursePricing, setNursePricing] = useState<ServicePrice[]>([
    {
      id: "1",
      name: "Hourly Care (per hour)",
      description: "General nursing care per hour",
      basePrice: 600,
      discount: 0,
    },
    {
      id: "2",
      name: "Shift Care (12 hours)",
      description: "Full 12-hour shift care",
      basePrice: 6000,
      discount: 5,
    },
    {
      id: "3",
      name: "24-Hour Care",
      description: "Full day 24-hour nursing",
      basePrice: 10000,
      discount: 10,
    },
    {
      id: "4",
      name: "Post-Surgery Care Package",
      description: "Specialized post-operative care",
      basePrice: 5000,
      discount: 0,
    },
    {
      id: "5",
      name: "Wound Care",
      description: "Professional wound dressing and care",
      basePrice: 800,
      discount: 0,
    },
  ]);

  if (!isDoctor && !isNurse) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="p-4 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Access Restricted</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                This page is only for doctors and nurses. Your role: <span className="font-medium">{serviceType || "Not set"}</span>
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

  const pricing = isDoctor ? doctorPricing : nursePricing;
  const setPricing = isDoctor ? setDoctorPricing : setNursePricing;

  const handlePriceChange = (id: string, field: "basePrice" | "discount", value: number) => {
    setPricing((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, [field]: value }
          : service
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Pricing updated successfully!");
    }, 1500);
  };

  const PricingCard = ({ service }: { service: ServicePrice }) => {
    const finalPrice = service.basePrice - (service.basePrice * (service.discount || 0) / 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-xl overflow-hidden"
      >
        <CardContent className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">{service.name}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">
                Base Price (₹)
              </label>
              <Input
                type="number"
                value={service.basePrice}
                onChange={(e) => handlePriceChange(service.id, "basePrice", parseFloat(e.target.value) || 0)}
                className="mt-1"
                min="0"
                step="10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Discount (%)
              </label>
              <Input
                type="number"
                value={service.discount || 0}
                onChange={(e) => handlePriceChange(service.id, "discount", parseFloat(e.target.value) || 0)}
                className="mt-1"
                min="0"
                max="100"
                step="5"
              />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Final Price</p>
              <p className="text-xl font-bold text-primary">₹{finalPrice.toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Header */}
      <motion.section
        className="px-4 pt-6 pb-4 border-b border-border/50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(isDoctor ? "/doctor-provider" : "/nurse-provider")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Pricing Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your service rates and offers
            </p>
          </div>
        </div>
      </motion.section>

      <main className="container px-4 py-6">
        {/* Doctor Pricing */}
        {isDoctor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle>Consultation Rates</CardTitle>
                <CardDescription>
                  Set your rates for different types of consultations
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {pricing.map((service) => (
                <PricingCard key={service.id} service={service} />
              ))}
            </div>

            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Services Offered</p>
                      <p className="font-semibold text-foreground">{pricing.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg. Price</p>
                      <p className="font-semibold text-foreground">
                        ₹{Math.round(pricing.reduce((sum, s) => sum + s.basePrice, 0) / pricing.length)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Nurse Pricing */}
        {isNurse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader>
                <CardTitle>Nursing Service Rates</CardTitle>
                <CardDescription>
                  Set your rates for different nursing services and packages
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {pricing.map((service) => (
                <PricingCard key={service.id} service={service} />
              ))}
            </div>

            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Services Offered</p>
                      <p className="font-semibold text-foreground">{pricing.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg. Price</p>
                      <p className="font-semibold text-foreground">
                        ₹{Math.round(pricing.reduce((sum, s) => sum + s.basePrice, 0) / pricing.length)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Section */}
        <Card className="mt-6 bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-4">
            <h4 className="font-semibold text-foreground mb-2">Tips for Setting Prices</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Research market rates in your area</li>
              <li>✓ Consider your experience and qualifications</li>
              <li>✓ Offer discounts for package deals or long-term commitments</li>
              <li>✓ Adjust prices based on demand and seasons</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mt-8"
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(isDoctor ? "/doctor-provider" : "/nurse-provider")}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PricingSettings;
