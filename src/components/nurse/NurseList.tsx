import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Clock, Languages, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SelectedService, SelectedNurse } from "@/pages/PartTimeNurse";

const nurses: SelectedNurse[] = [
  {
    id: "nurse-1",
    name: "Sister Mary Thomas",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    experience: "12 years",
    specializations: ["Elderly Care", "Post-Surgery", "IV & Injections"],
    languages: ["English", "Hindi", "Malayalam"],
    verified: true,
    totalBookings: 847,
  },
  {
    id: "nurse-2",
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    experience: "8 years",
    specializations: ["Wound Care", "Vitals Monitoring", "Medication"],
    languages: ["English", "Hindi"],
    verified: true,
    totalBookings: 523,
  },
  {
    id: "nurse-3",
    name: "Anjali Reddy",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    experience: "6 years",
    specializations: ["Injections", "Elderly Care", "Vitals"],
    languages: ["English", "Hindi", "Telugu"],
    verified: true,
    totalBookings: 312,
  },
  {
    id: "nurse-4",
    name: "Sunita Devi",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    experience: "10 years",
    specializations: ["Post-Surgery Care", "Wound Care", "Elderly Care"],
    languages: ["English", "Hindi"],
    verified: true,
    totalBookings: 689,
  },
];

interface NurseListProps {
  selectedServices: SelectedService[];
  onSelect: (nurse: SelectedNurse) => void;
  onBack: () => void;
}

const NurseList = ({ selectedServices, onSelect, onBack }: NurseListProps) => {
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "bookings">("rating");

  const sortedNurses = [...nurses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return parseInt(b.experience) - parseInt(a.experience);
      case "bookings":
        return b.totalBookings - a.totalBookings;
      default:
        return 0;
    }
  });

  return (
    <div className="px-4 py-6">
      {/* Selected Services Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-service-nurse/10 rounded-xl p-4 mb-6"
      >
        <p className="text-sm text-muted-foreground mb-2">Selected Services:</p>
        <div className="flex flex-wrap gap-2">
          {selectedServices.map((service) => (
            <span
              key={service.id}
              className="px-3 py-1 bg-service-nurse/20 text-service-nurse rounded-full text-sm font-medium"
            >
              {service.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
        {[
          { key: "rating", label: "Top Rated" },
          { key: "experience", label: "Experience" },
          { key: "bookings", label: "Most Booked" },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key as typeof sortBy)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              sortBy === option.key
                ? "bg-service-nurse text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Nurses List */}
      <div className="space-y-4">
        {sortedNurses.map((nurse, index) => (
          <motion.div
            key={nurse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm"
          >
            <div className="flex gap-4">
              {/* Nurse Image */}
              <div className="relative">
                <img
                  src={nurse.image}
                  alt={nurse.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                {nurse.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              {/* Nurse Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{nurse.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{nurse.rating}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {nurse.totalBookings} bookings
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience & Languages */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{nurse.experience}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Languages className="w-4 h-4" />
                    <span>{nurse.languages.slice(0, 2).join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="mt-3">
              <div className="flex items-center gap-1 mb-2">
                <Award className="w-4 h-4 text-service-nurse" />
                <span className="text-sm font-medium text-foreground">Specializations</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {nurse.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Book Button */}
            <Button
              onClick={() => onSelect(nurse)}
              className="w-full mt-4 bg-service-nurse hover:bg-service-nurse/90"
            >
              Book {nurse.name.split(" ")[0]}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NurseList;
