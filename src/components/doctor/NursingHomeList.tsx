import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Clock, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SelectedNursingHome } from "@/pages/DoctorAppointment";

interface NursingHomeListProps {
  specialty: string;
  onSelect: (nursingHome: SelectedNursingHome) => void;
  onBack: () => void;
}

const nursingHomes: SelectedNursingHome[] = [
  // Delhi NCR Region
  {
    id: "1",
    name: "Care Plus Nursing Home",
    address: "Sector 18, Noida",
    rating: 4.8,
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Wellness Medical Center",
    address: "Greater Kailash, Delhi",
    rating: 4.6,
    distance: "2.5 km",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "LifeLine Health Clinic",
    address: "Vaishali, Ghaziabad",
    rating: 4.5,
    distance: "3.8 km",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Medanta Nursing Home",
    address: "Sector 38, Gurugram",
    rating: 4.9,
    distance: "5.2 km",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
  // Mumbai & Western Region
  {
    id: "5",
    name: "Apollo Health Center Mumbai",
    address: "Bandra, Mumbai",
    rating: 4.9,
    distance: "2.1 km",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Max Healthcare Worli",
    address: "Worli, Mumbai",
    rating: 4.7,
    distance: "3.5 km",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b2e?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    name: "Fortis Hospital Mulund",
    address: "Mulund, Mumbai",
    rating: 4.8,
    distance: "4.2 km",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
  {
    id: "8",
    name: "Pune Care Medical Center",
    address: "Koregaon Park, Pune",
    rating: 4.6,
    distance: "2.8 km",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  // Bangalore & South Region
  {
    id: "9",
    name: "Narayana Health Bangalore",
    address: "Whitefield, Bangalore",
    rating: 4.9,
    distance: "1.8 km",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  {
    id: "10",
    name: "Apollo Clinic Indiranagar",
    address: "Indiranagar, Bangalore",
    rating: 4.7,
    distance: "3.2 km",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
  {
    id: "11",
    name: "Manipal Hospital Bangalore",
    address: "Malleshwaram, Bangalore",
    rating: 4.8,
    distance: "2.5 km",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b2e?w=400&h=300&fit=crop",
  },
  {
    id: "12",
    name: "Global Hospital Chennai",
    address: "Perumbakkam, Chennai",
    rating: 4.6,
    distance: "4.1 km",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
  {
    id: "13",
    name: "Kauvery Hospital Madurai",
    address: "Bypass Road, Madurai",
    rating: 4.7,
    distance: "3.8 km",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  // Hyderabad & Central Region
  {
    id: "14",
    name: "KIMS Hospitals Hyderabad",
    address: "Kondapur, Hyderabad",
    rating: 4.9,
    distance: "2.3 km",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  {
    id: "15",
    name: "Apollo Clinic Hyderabad",
    address: "Jubilee Hills, Hyderabad",
    rating: 4.8,
    distance: "1.9 km",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
  {
    id: "16",
    name: "Care Hospital Hyderabad",
    address: "Banjara Hills, Hyderabad",
    rating: 4.7,
    distance: "3.1 km",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b2e?w=400&h=300&fit=crop",
  },
  // Kolkata & Eastern Region
  {
    id: "17",
    name: "Fortis Hospital Kolkata",
    address: "Alipore, Kolkata",
    rating: 4.6,
    distance: "2.7 km",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
  {
    id: "18",
    name: "Apollo Gleneagles Kolkata",
    address: "Park Circus, Kolkata",
    rating: 4.8,
    distance: "3.5 km",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  {
    id: "19",
    name: "Patna Medical Center",
    address: "Boring Road, Patna",
    rating: 4.5,
    distance: "4.0 km",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  // Ahmedabad & Western Region
  {
    id: "20",
    name: "UN Mehta Institute Ahmedabad",
    address: "Ahmedabad Medical College, Ahmedabad",
    rating: 4.9,
    distance: "2.6 km",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
  {
    id: "21",
    name: "Apollo Clinic Ahmedabad",
    address: "Khanpur, Ahmedabad",
    rating: 4.7,
    distance: "3.3 km",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b2e?w=400&h=300&fit=crop",
  },
  {
    id: "22",
    name: "Surat Healthcare Center",
    address: "Adajan, Surat",
    rating: 4.6,
    distance: "2.9 km",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
  // Jaipur & Northern Region
  {
    id: "23",
    name: "Fortis Escorts Jaipur",
    address: "C-Scheme, Jaipur",
    rating: 4.8,
    distance: "2.2 km",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  {
    id: "24",
    name: "Max Healthcare Jaipur",
    address: "Sector 1, Amanvilas, Jaipur",
    rating: 4.7,
    distance: "3.7 km",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  // Lucknow & Eastern Region
  {
    id: "25",
    name: "Medanta Lucknow",
    address: "Gomti Nagar, Lucknow",
    rating: 4.8,
    distance: "2.4 km",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
];

const NursingHomeList = ({ specialty, onSelect, onBack }: NursingHomeListProps) => {
  return (
    <div className="px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Nursing Homes</h1>
          <p className="text-sm text-muted-foreground">{specialty} specialists</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Badge variant="outline" className="flex items-center gap-1 px-4 py-2 rounded-full whitespace-nowrap cursor-pointer hover:bg-primary/10">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 rounded-full whitespace-nowrap cursor-pointer">
          Nearest
        </Badge>
        <Badge variant="outline" className="px-4 py-2 rounded-full whitespace-nowrap cursor-pointer hover:bg-primary/10">
          Top Rated
        </Badge>
        <Badge variant="outline" className="px-4 py-2 rounded-full whitespace-nowrap cursor-pointer hover:bg-primary/10">
          Open Now
        </Badge>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {nursingHomes.length} nursing homes found
      </p>

      {/* Nursing Home Cards */}
      <div className="space-y-4">
        {nursingHomes.map((home, index) => (
          <motion.button
            key={home.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(home)}
            className="w-full bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99] text-left"
          >
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={home.image}
                  alt={home.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-semibold text-foreground truncate">{home.name}</h3>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{home.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-medium text-foreground">{home.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{home.distance}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NursingHomeList;
