import { motion } from "framer-motion";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Place {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  image: string;
}

const places: Place[] = [
  {
    id: "1",
    name: "Care Plus Nursing Home",
    city: "Noida",
    address: "Sector 18, Noida",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Apollo Health Center",
    city: "Mumbai",
    address: "Bandra, Mumbai",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  },
  {
    id: "9",
    name: "Narayana Health",
    city: "Bangalore",
    address: "Whitefield, Bangalore",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
  },
  {
    id: "14",
    name: "KIMS Hospitals",
    city: "Hyderabad",
    address: "Kondapur, Hyderabad",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b2e?w=400&h=300&fit=crop",
  },
  {
    id: "18",
    name: "Apollo Gleneagles",
    city: "Kolkata",
    address: "Park Circus, Kolkata",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
  },
  {
    id: "20",
    name: "UN Mehta Institute",
    city: "Ahmedabad",
    address: "Ahmedabad Medical College",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
  },
];

const FeaturedPlaces = () => {
  const navigate = useNavigate();

  return (
    <motion.section 
      className="px-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Featured Places Across India</h2>
        </div>
        <button 
          onClick={() => navigate("/doctor-appointment")}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
        </button>
      </div>
      
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4 min-w-min">
          {places.map((place, index) => (
            <motion.button
              key={place.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate("/doctor-appointment")}
              className="relative w-72 h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
            >
              {/* Background Image */}
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    {place.city}
                  </div>
                  <div className="flex items-center gap-1 bg-warning/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-warning" />
                    <span className="text-sm font-semibold">{place.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{place.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-200">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{place.address}</span>
                  </div>
                </div>
              </div>
              
              {/* Hover Indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-3 rounded-xl bg-card border border-border/50 text-center"
        >
          <div className="text-2xl font-bold text-primary">25+</div>
          <div className="text-xs text-muted-foreground">Locations</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-xl bg-card border border-border/50 text-center"
        >
          <div className="text-2xl font-bold text-primary">12+</div>
          <div className="text-xs text-muted-foreground">Major Cities</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-3 rounded-xl bg-card border border-border/50 text-center"
        >
          <div className="text-2xl font-bold text-primary">4.8★</div>
          <div className="text-xs text-muted-foreground">Avg Rating</div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedPlaces;
