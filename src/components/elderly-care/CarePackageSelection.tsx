import { motion } from "framer-motion";
import { Check, Clock, Calendar, Star, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CarePackage } from "@/pages/ElderlyCare";

const packages: CarePackage[] = [
  {
    id: "daily-basic",
    name: "Daily Basic Care",
    type: "daily",
    price: 999,
    duration: "8 hours/day",
    features: [
      "Medication reminders",
      "Vital signs monitoring",
      "Light mobility assistance",
      "Companionship & conversation",
    ],
  },
  {
    id: "daily-premium",
    name: "Daily Premium Care",
    type: "daily",
    price: 1499,
    duration: "12 hours/day",
    features: [
      "All Basic Care features",
      "Bathing & grooming assistance",
      "Meal preparation & feeding",
      "Light physiotherapy exercises",
      "Night care available (+₹500)",
    ],
  },
  {
    id: "monthly-essential",
    name: "Monthly Essential",
    type: "monthly",
    price: 24999,
    duration: "8 hours/day, 30 days",
    features: [
      "Dedicated caregiver",
      "Daily health reports",
      "Medication management",
      "Mobility & exercise support",
      "24/7 emergency support",
    ],
  },
  {
    id: "monthly-comprehensive",
    name: "Monthly Comprehensive",
    type: "monthly",
    price: 39999,
    duration: "12 hours/day, 30 days",
    features: [
      "All Essential features",
      "Complete personal care",
      "Meal planning & feeding",
      "Physical therapy sessions",
      "Weekly doctor consultations",
      "Family progress reports",
    ],
  },
];

interface CarePackageSelectionProps {
  selectedPackage: CarePackage | null;
  onSelectPackage: (pkg: CarePackage) => void;
}

const CarePackageSelection = ({
  selectedPackage,
  onSelectPackage,
}: CarePackageSelectionProps) => {
  const dailyPackages = packages.filter((p) => p.type === "daily");
  const monthlyPackages = packages.filter((p) => p.type === "monthly");

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Trust Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/10 rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">Verified & Trained Caregivers</p>
          <p className="text-xs text-muted-foreground">
            Background checked, certified in elderly care
          </p>
        </div>
      </motion.div>

      {/* Daily Packages */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Daily Packages</h2>
        </div>
        <div className="space-y-3">
          {dailyPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPackage?.id === pkg.id
                    ? "ring-2 ring-primary border-primary"
                    : ""
                }`}
                onClick={() => onSelectPackage(pkg)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {pkg.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ₹{pkg.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">/day</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {pkg.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monthly Packages */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Monthly Packages</h2>
          <Badge variant="secondary" className="text-xs">
            Best Value
          </Badge>
        </div>
        <div className="space-y-3">
          {monthlyPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPackage?.id === pkg.id
                    ? "ring-2 ring-primary border-primary"
                    : ""
                } ${pkg.id === "monthly-comprehensive" ? "border-primary/50" : ""}`}
                onClick={() => onSelectPackage(pkg)}
              >
                <CardContent className="p-4">
                  {pkg.id === "monthly-comprehensive" && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium text-primary">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {pkg.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ₹{pkg.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {pkg.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <p className="text-xs text-center text-muted-foreground px-4">
        All packages include 24/7 emergency helpline access and flexible
        cancellation
      </p>
    </div>
  );
};

export default CarePackageSelection;
