import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Phone, MessageCircle, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Caregiver } from "@/pages/ElderlyCare";

const caregivers: Caregiver[] = [
  {
    id: "cg1",
    name: "Sunita Sharma",
    age: 42,
    experience: 12,
    rating: 4.9,
    reviews: 156,
    specializations: ["Dementia Care", "Post-Surgery", "Diabetes Management"],
    languages: ["Hindi", "English"],
    image: "",
    verified: true,
    gender: "Female",
  },
  {
    id: "cg2",
    name: "Ramesh Kumar",
    age: 38,
    experience: 8,
    rating: 4.8,
    reviews: 98,
    specializations: ["Mobility Assistance", "Stroke Recovery", "Physiotherapy"],
    languages: ["Hindi", "English", "Punjabi"],
    image: "",
    verified: true,
    gender: "Male",
  },
  {
    id: "cg3",
    name: "Meena Devi",
    age: 45,
    experience: 15,
    rating: 4.9,
    reviews: 203,
    specializations: ["Alzheimer's Care", "Palliative Care", "Night Care"],
    languages: ["Hindi", "Bengali"],
    image: "",
    verified: true,
    gender: "Female",
  },
  {
    id: "cg4",
    name: "Anil Verma",
    age: 35,
    experience: 6,
    rating: 4.7,
    reviews: 67,
    specializations: ["General Care", "Medication Management", "Companionship"],
    languages: ["Hindi", "English"],
    image: "",
    verified: true,
    gender: "Male",
  },
  {
    id: "cg5",
    name: "Lakshmi Iyer",
    age: 48,
    experience: 18,
    rating: 5.0,
    reviews: 245,
    specializations: ["Critical Care", "Wound Care", "Bedridden Patients"],
    languages: ["Hindi", "English", "Tamil"],
    image: "",
    verified: true,
    gender: "Female",
  },
];

interface CaregiverListProps {
  onSelectCaregiver: (caregiver: Caregiver) => void;
}

const CaregiverList = ({ onSelectCaregiver }: CaregiverListProps) => {
  const [sortBy, setSortBy] = useState("rating");
  const [genderFilter, setGenderFilter] = useState("all");

  const filteredCaregivers = caregivers
    .filter((cg) => genderFilter === "all" || cg.gender === genderFilter)
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experience - a.experience;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Filters */}
      <div className="flex gap-3">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>

        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="flex-1">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Caregiver Cards */}
      <div className="space-y-3">
        {filteredCaregivers.map((caregiver, index) => (
          <motion.div
            key={caregiver.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={caregiver.image} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {caregiver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold truncate">
                            {caregiver.name}
                          </h3>
                          {caregiver.verified && (
                            <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {caregiver.age} yrs • {caregiver.experience} yrs exp
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          {caregiver.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({caregiver.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {caregiver.specializations.slice(0, 2).map((spec) => (
                        <Badge
                          key={spec}
                          variant="secondary"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                      {caregiver.specializations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{caregiver.specializations.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Languages */}
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Speaks: {caregiver.languages.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:+919876543210`;
                    }}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onSelectCaregiver(caregiver)}
                  >
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Note */}
      <p className="text-xs text-center text-muted-foreground">
        All caregivers are verified, trained, and background checked
      </p>
    </div>
  );
};

export default CaregiverList;
