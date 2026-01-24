import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Languages,
  Filter,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeVisitDoctor } from "@/pages/DoctorHomeVisit";

interface HomeVisitDoctorListProps {
  doctorType: "GP" | "Specialist";
  specialty?: string;
  onSelect: (doctor: HomeVisitDoctor) => void;
  onBack: () => void;
}

const gpDoctors: HomeVisitDoctor[] = [
  {
    id: "gp1",
    name: "Dr. Rajesh Kumar",
    type: "GP",
    qualification: "MBBS, MD (General Medicine)",
    experience: "12 years",
    rating: 4.8,
    reviewCount: 324,
    visitFee: 499,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English"],
    verified: true,
  },
  {
    id: "gp2",
    name: "Dr. Priya Sharma",
    type: "GP",
    qualification: "MBBS, DNB (Family Medicine)",
    experience: "8 years",
    rating: 4.9,
    reviewCount: 256,
    visitFee: 499,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English", "Punjabi"],
    verified: true,
  },
  {
    id: "gp3",
    name: "Dr. Amit Verma",
    type: "GP",
    qualification: "MBBS, PGDM (Healthcare)",
    experience: "15 years",
    rating: 4.7,
    reviewCount: 412,
    visitFee: 499,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English"],
    verified: true,
  },
];

const specialistDoctors: HomeVisitDoctor[] = [
  {
    id: "sp1",
    name: "Dr. Ananya Reddy",
    type: "Specialist",
    specialty: "Cardiologist",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: "18 years",
    rating: 4.9,
    reviewCount: 567,
    visitFee: 1299,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English", "Telugu"],
    verified: true,
  },
  {
    id: "sp2",
    name: "Dr. Sanjay Patel",
    type: "Specialist",
    specialty: "Neurologist",
    qualification: "MBBS, MD, DM (Neurology)",
    experience: "20 years",
    rating: 4.8,
    reviewCount: 423,
    visitFee: 1499,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English", "Gujarati"],
    verified: true,
  },
  {
    id: "sp3",
    name: "Dr. Meera Iyer",
    type: "Specialist",
    specialty: "Orthopedic",
    qualification: "MBBS, MS (Ortho), DNB",
    experience: "14 years",
    rating: 4.7,
    reviewCount: 289,
    visitFee: 999,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English", "Tamil"],
    verified: true,
  },
  {
    id: "sp4",
    name: "Dr. Kavita Singh",
    type: "Specialist",
    specialty: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics)",
    experience: "10 years",
    rating: 4.9,
    reviewCount: 512,
    visitFee: 799,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    languages: ["Hindi", "English"],
    verified: true,
  },
];

const HomeVisitDoctorList = ({ doctorType, specialty, onSelect, onBack }: HomeVisitDoctorListProps) => {
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "fee">("rating");
  
  const baseDoctors = doctorType === "GP" ? gpDoctors : specialistDoctors;
  const doctors = specialty 
    ? baseDoctors.filter(d => d.specialty?.toLowerCase().includes(specialty.toLowerCase()))
    : baseDoctors;

  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "experience") return parseInt(b.experience) - parseInt(a.experience);
    return a.visitFee - b.visitFee;
  });

  return (
    <div className="px-4 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {doctorType === "GP" ? "General Physicians" : specialty || "Specialists"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {sortedDoctors.length} doctors available for home visit
          </p>
        </div>
      </motion.div>

      {/* Sort Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-2"
      >
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {[
          { key: "rating", label: "Top Rated" },
          { key: "experience", label: "Most Experienced" },
          { key: "fee", label: "Lowest Fee" },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key as typeof sortBy)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              sortBy === option.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </motion.div>

      {/* Doctor Cards */}
      <div className="space-y-3">
        {sortedDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
          >
            <div className="flex gap-4">
              {/* Doctor Image */}
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                {doctor.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {doctor.qualification}
                    </p>
                    {doctor.specialty && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {doctor.specialty}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-warning-light">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    <span className="text-xs font-semibold text-warning">{doctor.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    <span>{doctor.languages.join(", ")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Home Visit Fee</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-primary">₹{doctor.visitFee}</span>
                      <span className="text-xs text-muted-foreground">fixed</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onSelect(doctor)}
                    size="sm"
                    className="rounded-xl bg-service-home-visit hover:bg-service-home-visit/90 text-white"
                  >
                    Book Visit
                  </Button>
                </div>
              </div>
            </div>

            {/* Available Slots Preview */}
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-xs text-success font-medium">Available today</span>
              <span className="text-xs text-muted-foreground">• Next slot: 2:00 PM</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-2xl bg-warning-light border border-warning/20"
      >
        <p className="text-sm text-warning-foreground font-medium">
          ⏰ Book before 12 PM for same-day evening visits. Morning slots require advance booking.
        </p>
      </motion.div>
    </div>
  );
};

export default HomeVisitDoctorList;
