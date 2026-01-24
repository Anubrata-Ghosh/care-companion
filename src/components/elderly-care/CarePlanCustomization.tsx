import { motion } from "framer-motion";
import {
  Pill,
  Footprints,
  Bath,
  UtensilsCrossed,
  Heart,
  Dumbbell,
  Activity,
  Moon,
  Calendar,
  MapPin,
  User,
  Phone,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { ElderlyCareBooking, CarePlan } from "@/pages/ElderlyCare";

const careOptions = [
  {
    id: "medications",
    label: "Medication Management",
    description: "Timely medication reminders & administration",
    icon: Pill,
  },
  {
    id: "mobility",
    label: "Mobility Assistance",
    description: "Help with walking, transfers & movement",
    icon: Footprints,
  },
  {
    id: "bathing",
    label: "Bathing & Grooming",
    description: "Personal hygiene and grooming assistance",
    icon: Bath,
  },
  {
    id: "feeding",
    label: "Meal Preparation & Feeding",
    description: "Cooking and feeding assistance",
    icon: UtensilsCrossed,
  },
  {
    id: "companionship",
    label: "Companionship",
    description: "Conversation, reading, and emotional support",
    icon: Heart,
  },
  {
    id: "exercises",
    label: "Light Exercises",
    description: "Gentle physiotherapy and stretching",
    icon: Dumbbell,
  },
  {
    id: "vitals",
    label: "Vital Signs Monitoring",
    description: "Regular BP, sugar, and temperature checks",
    icon: Activity,
  },
  {
    id: "nightCare",
    label: "Night Care",
    description: "Overnight assistance and monitoring",
    icon: Moon,
  },
];

interface CarePlanCustomizationProps {
  booking: ElderlyCareBooking;
  onUpdateBooking: (updates: Partial<ElderlyCareBooking>) => void;
  onConfirm: () => void;
}

const CarePlanCustomization = ({
  booking,
  onUpdateBooking,
  onConfirm,
}: CarePlanCustomizationProps) => {
  const { carePlan, elderlyDetails, package: selectedPackage } = booking;

  const updateCarePlan = (key: keyof CarePlan, value: boolean) => {
    onUpdateBooking({
      carePlan: { ...carePlan, [key]: value },
    });
  };

  const updateElderlyDetails = (
    key: keyof typeof elderlyDetails,
    value: string | Date | undefined
  ) => {
    onUpdateBooking({
      elderlyDetails: { ...elderlyDetails, [key]: value },
    });
  };

  const isFormValid =
    elderlyDetails.name &&
    elderlyDetails.age &&
    elderlyDetails.address &&
    elderlyDetails.emergencyContact &&
    elderlyDetails.startDate;

  // Calculate price
  const basePrice = selectedPackage?.price || 0;
  const nightCareExtra =
    carePlan.nightCare && selectedPackage?.type === "daily" ? 500 : 0;
  const totalPrice = basePrice + nightCareExtra;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Care Plan Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Customize Care Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {careOptions.map((option) => {
              const Icon = option.icon;
              const isEnabled = carePlan[option.id as keyof CarePlan];

              return (
                <div
                  key={option.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isEnabled
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <Label
                        htmlFor={option.id}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={option.id}
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      updateCarePlan(option.id as keyof CarePlan, checked)
                    }
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Elderly Person Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name *</Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={elderlyDetails.name}
                  onChange={(e) => updateElderlyDetails("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  placeholder="Age"
                  type="number"
                  value={elderlyDetails.age}
                  onChange={(e) => updateElderlyDetails("age", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="E.g., Diabetes, Hypertension, Arthritis..."
                value={elderlyDetails.conditions}
                onChange={(e) =>
                  updateElderlyDetails("conditions", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Care Address *
              </Label>
              <Textarea
                id="address"
                placeholder="Full address where care will be provided"
                value={elderlyDetails.address}
                onChange={(e) =>
                  updateElderlyDetails("address", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="emergencyContact"
                className="flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                Emergency Contact *
              </Label>
              <Input
                id="emergencyContact"
                placeholder="Phone number"
                type="tel"
                value={elderlyDetails.emergencyContact}
                onChange={(e) =>
                  updateElderlyDetails("emergencyContact", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Start Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {elderlyDetails.startDate ? (
                      format(elderlyDetails.startDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">
                        Select start date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={elderlyDetails.startDate}
                    onSelect={(date) => updateElderlyDetails("startDate", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {selectedPackage?.name}
                </span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              {nightCareExtra > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Night Care (add-on)
                  </span>
                  <span>+₹{nightCareExtra}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">
                  ₹{totalPrice.toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground">
                    /{selectedPackage?.type === "daily" ? "day" : "month"}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirm Button */}
      <Button
        className="w-full h-12 text-base"
        size="lg"
        disabled={!isFormValid}
        onClick={onConfirm}
      >
        Confirm Booking
      </Button>
    </div>
  );
};

export default CarePlanCustomization;
