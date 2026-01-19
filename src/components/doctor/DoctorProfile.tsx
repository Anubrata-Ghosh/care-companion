import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Languages, Award, Video, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SelectedDoctor, SelectedNursingHome } from "@/pages/DoctorAppointment";

interface DoctorProfileProps {
  nursingHome: SelectedNursingHome;
  specialty: string;
  onSelect: (doctor: SelectedDoctor) => void;
  onBack: () => void;
}

const doctors: SelectedDoctor[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    qualification: "MBBS, MD",
    experience: "15 years",
    rating: 4.9,
    reviewCount: 847,
    consultationFee: 500,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    nursingHome: "Care Plus Nursing Home",
    languages: ["Hindi", "English"],
    availability: "Available Today",
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    qualification: "MBBS, DNB",
    experience: "12 years",
    rating: 4.7,
    reviewCount: 523,
    consultationFee: 400,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    nursingHome: "Care Plus Nursing Home",
    languages: ["Hindi", "English", "Punjabi"],
    availability: "Next Slot: 4:00 PM",
  },
  {
    id: "3",
    name: "Dr. Ananya Patel",
    specialty: "General Physician",
    qualification: "MBBS, FCPS",
    experience: "8 years",
    rating: 4.8,
    reviewCount: 312,
    consultationFee: 350,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
    nursingHome: "Care Plus Nursing Home",
    languages: ["Hindi", "English", "Gujarati"],
    availability: "Available Today",
  },
];

const DoctorProfile = ({ nursingHome, specialty, onSelect, onBack }: DoctorProfileProps) => {
  return (
    <div className="space-y-4">
      {/* Header with Nursing Home Info */}
      <div className="px-4 space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{nursingHome.name}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{nursingHome.address}</span>
            </div>
          </div>
        </div>

        {/* Nursing Home Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-32 rounded-2xl overflow-hidden"
        >
          <img
            src={nursingHome.image}
            alt={nursingHome.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge className="bg-white/90 text-foreground hover:bg-white">
              <Star className="w-3.5 h-3.5 text-warning fill-warning mr-1" />
              {nursingHome.rating}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {specialty}
            </Badge>
          </div>
        </motion.div>

        <h2 className="text-lg font-semibold text-foreground">
          Available Doctors ({doctors.length})
        </h2>
      </div>

      {/* Doctor Cards */}
      <div className="px-4 space-y-4">
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm"
          >
            {/* Doctor Info */}
            <div className="p-4 space-y-4">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
                    <Video className="w-3 h-3 text-success-foreground" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="font-medium text-foreground">{doctor.rating}</span>
                      <span className="text-muted-foreground">({doctor.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span>{doctor.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full text-xs">
                  <Languages className="w-3 h-3 mr-1" />
                  {doctor.languages.join(", ")}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`rounded-full text-xs ${
                    doctor.availability.includes("Available") 
                      ? "border-success text-success" 
                      : "border-warning text-warning"
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {doctor.availability}
                </Badge>
              </div>

              {/* Fee and Book Button */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Consultation Fee</p>
                  <p className="text-lg font-bold text-foreground">₹{doctor.consultationFee}</p>
                </div>
                <Button
                  onClick={() => onSelect(doctor)}
                  className="rounded-xl px-6 bg-primary hover:bg-primary/90"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfile;
