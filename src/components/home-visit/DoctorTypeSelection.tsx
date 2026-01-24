import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  UserRound, 
  Heart, 
  Brain, 
  Bone, 
  Baby,
  Eye,
  Thermometer,
  ArrowRight,
  Home,
  Shield,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorTypeSelectionProps {
  onSelect: (type: "GP" | "Specialist", specialty?: string) => void;
}

const specialties = [
  { name: "Cardiologist", icon: Heart, color: "bg-red-100 text-red-600" },
  { name: "Neurologist", icon: Brain, color: "bg-purple-100 text-purple-600" },
  { name: "Orthopedic", icon: Bone, color: "bg-amber-100 text-amber-600" },
  { name: "Pediatrician", icon: Baby, color: "bg-pink-100 text-pink-600" },
  { name: "Ophthalmologist", icon: Eye, color: "bg-cyan-100 text-cyan-600" },
  { name: "General Medicine", icon: Thermometer, color: "bg-teal-100 text-teal-600" },
];

const DoctorTypeSelection = ({ onSelect }: DoctorTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState<"GP" | "Specialist" | null>(null);

  return (
    <div className="px-4 space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-service-home-visit via-amber-500 to-orange-500 p-6 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Home Visit</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Doctor at Your Doorstep</h1>
          <p className="text-white/80 text-sm">
            Get checked by qualified doctors in the comfort of your home
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-8 -top-4 w-16 h-16 rounded-full bg-white/10" />
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: Clock, text: "Same Day Visit", color: "text-primary" },
          { icon: Shield, text: "Verified Doctors", color: "text-success" },
          { icon: Home, text: "Fixed Charges", color: "text-service-home-visit" },
        ].map((benefit, index) => (
          <div
            key={benefit.text}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/50"
          >
            <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
            <span className="text-xs font-medium text-center text-muted-foreground">
              {benefit.text}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Doctor Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-foreground">Choose Doctor Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* GP Card */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType("GP")}
            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedType === "GP"
                ? "border-primary bg-primary-light"
                : "border-border/50 bg-card hover:border-primary/30"
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserRound className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">General Physician</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Fever, cold, routine checkups
                </p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-primary">₹499</span>
                <span className="text-xs text-muted-foreground">fixed</span>
              </div>
            </div>
            {selectedType === "GP" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>

          {/* Specialist Card */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType("Specialist")}
            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedType === "Specialist"
                ? "border-service-home-visit bg-service-home-visit-light"
                : "border-border/50 bg-card hover:border-service-home-visit/30"
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-service-home-visit/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-service-home-visit" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Specialist</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Heart, brain, bone specialists
                </p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-service-home-visit">₹799+</span>
                <span className="text-xs text-muted-foreground">onwards</span>
              </div>
            </div>
            {selectedType === "Specialist" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-service-home-visit flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Specialty Selection (if Specialist selected) */}
      {selectedType === "Specialist" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-foreground">Select Specialty</h2>
          <div className="grid grid-cols-3 gap-3">
            {specialties.map((specialty, index) => (
              <motion.button
                key={specialty.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect("Specialist", specialty.name)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-service-home-visit/30 transition-all duration-200 active:scale-95"
              >
                <div className={`w-12 h-12 rounded-xl ${specialty.color} flex items-center justify-center`}>
                  <specialty.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {specialty.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue Button for GP */}
      {selectedType === "GP" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => onSelect("GP")}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-semibold"
          >
            Continue with GP
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl bg-info-light border border-info/20"
      >
        <p className="text-sm text-info font-medium">
          💡 All our doctors carry essential diagnostic equipment for preliminary checkups at your home.
        </p>
      </motion.div>
    </div>
  );
};

export default DoctorTypeSelection;
