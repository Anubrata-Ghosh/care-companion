import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, Shield, Truck, ChevronRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PharmacySelectionProps {
  onSelect: (pharmacyId: string) => void;
}

interface Pharmacy {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  isVerified: boolean;
  isFastDelivery: boolean;
  discount: number;
  address: string;
}

const PharmacySelection = ({ onSelect }: PharmacySelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const pharmacies: Pharmacy[] = [
    {
      id: "apollo",
      name: "Apollo Pharmacy",
      image: "🏥",
      rating: 4.8,
      reviews: 2340,
      distance: "1.2 km",
      deliveryTime: "30-45 min",
      isVerified: true,
      isFastDelivery: true,
      discount: 15,
      address: "Near City Hospital, MG Road",
    },
    {
      id: "medplus",
      name: "MedPlus",
      image: "💊",
      rating: 4.6,
      reviews: 1890,
      distance: "0.8 km",
      deliveryTime: "25-35 min",
      isVerified: true,
      isFastDelivery: true,
      discount: 10,
      address: "Main Market, Sector 21",
    },
    {
      id: "netmeds",
      name: "Netmeds Store",
      image: "🩺",
      rating: 4.5,
      reviews: 1560,
      distance: "2.5 km",
      deliveryTime: "45-60 min",
      isVerified: true,
      isFastDelivery: false,
      discount: 20,
      address: "Shopping Complex, Ring Road",
    },
    {
      id: "wellness",
      name: "Wellness Forever",
      image: "💚",
      rating: 4.4,
      reviews: 980,
      distance: "1.8 km",
      deliveryTime: "35-50 min",
      isVerified: true,
      isFastDelivery: false,
      discount: 12,
      address: "Health Hub, Civil Lines",
    },
    {
      id: "pharmeasy",
      name: "PharmEasy Store",
      image: "🏪",
      rating: 4.7,
      reviews: 2100,
      distance: "3.0 km",
      deliveryTime: "50-70 min",
      isVerified: true,
      isFastDelivery: false,
      discount: 25,
      address: "Metro Station Complex",
    },
  ];

  const filters = [
    { id: "all", label: "All" },
    { id: "fast", label: "Fast Delivery" },
    { id: "nearby", label: "Nearby" },
    { id: "discount", label: "Best Offers" },
  ];

  const filteredPharmacies = pharmacies
    .filter((pharmacy) => {
      if (searchQuery) {
        return pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter((pharmacy) => {
      if (selectedFilter === "fast") return pharmacy.isFastDelivery;
      if (selectedFilter === "nearby") return parseFloat(pharmacy.distance) < 2;
      if (selectedFilter === "discount") return pharmacy.discount >= 15;
      return true;
    });

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search pharmacies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl bg-secondary/50"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
            className="shrink-0 rounded-full"
          >
            {filter.label}
          </Button>
        ))}
        <Button variant="outline" size="sm" className="shrink-0 rounded-full">
          <Filter className="h-4 w-4 mr-1" />
          More
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">100% Genuine Medicines</p>
            <p className="text-xs text-muted-foreground">All pharmacies are verified and licensed</p>
          </div>
        </CardContent>
      </Card>

      {/* Pharmacy List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {filteredPharmacies.length} Pharmacies Available
        </h3>

        {filteredPharmacies.map((pharmacy, index) => (
          <motion.div
            key={pharmacy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(pharmacy.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Pharmacy Icon */}
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl shrink-0">
                    {pharmacy.image}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground truncate">{pharmacy.name}</h4>
                        {pharmacy.isVerified && (
                          <Shield className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        {pharmacy.rating} ({pharmacy.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {pharmacy.distance}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {pharmacy.address}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {pharmacy.deliveryTime}
                      </Badge>
                      {pharmacy.isFastDelivery && (
                        <Badge className="bg-accent/20 text-accent-foreground text-xs">
                          <Truck className="h-3 w-3 mr-1" />
                          Express
                        </Badge>
                      )}
                      {pharmacy.discount > 0 && (
                        <Badge className="bg-green-500/20 text-green-600 text-xs">
                          {pharmacy.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PharmacySelection;
