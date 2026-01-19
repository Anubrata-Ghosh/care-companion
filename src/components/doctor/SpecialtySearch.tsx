import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart, Brain, Bone, Baby, Eye, Stethoscope, Activity, Pill, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SpecialtySearchProps {
  onSelect: (specialty: string) => void;
}

const specialties = [
  { name: "General Physician", icon: Stethoscope, color: "bg-primary/10 text-primary" },
  { name: "Cardiologist", icon: Heart, color: "bg-red-100 text-red-600" },
  { name: "Neurologist", icon: Brain, color: "bg-purple-100 text-purple-600" },
  { name: "Orthopedic", icon: Bone, color: "bg-orange-100 text-orange-600" },
  { name: "Pediatrician", icon: Baby, color: "bg-pink-100 text-pink-600" },
  { name: "Ophthalmologist", icon: Eye, color: "bg-blue-100 text-blue-600" },
  { name: "Dermatologist", icon: UserRound, color: "bg-amber-100 text-amber-600" },
  { name: "ENT Specialist", icon: Activity, color: "bg-teal-100 text-teal-600" },
  { name: "Gynecologist", icon: Pill, color: "bg-rose-100 text-rose-600" },
];

const SpecialtySearch = ({ onSelect }: SpecialtySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Book Doctor Appointment</h1>
          <p className="text-primary-foreground/80 text-sm">
            Find specialists at nursing homes near you
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-8 -top-4 w-16 h-16 rounded-full bg-white/10" />
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base shadow-sm"
        />
      </motion.div>

      {/* Specialty Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Choose Specialty</h2>
        <div className="grid grid-cols-3 gap-3">
          {filteredSpecialties.map((specialty, index) => (
            <motion.button
              key={specialty.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(specialty.name)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 active:scale-95"
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
      </div>

      {/* Popular Searches */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-foreground">Popular Searches</h2>
        <div className="flex flex-wrap gap-2">
          {["Fever", "Cold & Cough", "Diabetes", "BP Check", "Skin Issue", "Eye Checkup"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => onSelect("General Physician")}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SpecialtySearch;
