import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Home, Building, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format, addDays } from "date-fns";
import type { LabBooking } from "@/pages/LabTests";

interface ScheduleCollectionProps {
  booking: LabBooking;
  onUpdate: (updates: Partial<LabBooking>) => void;
  onProceed: () => void;
}

const timeSlots = [
  { id: "6-8am", label: "6:00 - 8:00 AM", recommended: true },
  { id: "8-10am", label: "8:00 - 10:00 AM", recommended: true },
  { id: "10-12pm", label: "10:00 AM - 12:00 PM", recommended: false },
  { id: "12-2pm", label: "12:00 - 2:00 PM", recommended: false },
  { id: "2-4pm", label: "2:00 - 4:00 PM", recommended: false },
  { id: "4-6pm", label: "4:00 - 6:00 PM", recommended: false },
];

const savedAddresses = [
  {
    id: "home",
    type: "Home",
    icon: Home,
    address: "A-101, Sunrise Apartments, Andheri West, Mumbai - 400058",
  },
  {
    id: "office",
    type: "Office",
    icon: Building,
    address: "Tech Park, 5th Floor, Powai, Mumbai - 400076",
  },
];

const ScheduleCollection = ({ booking, onUpdate, onProceed }: ScheduleCollectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(booking.date);
  const [selectedSlot, setSelectedSlot] = useState(booking.timeSlot);
  const [selectedAddress, setSelectedAddress] = useState(booking.address || savedAddresses[0].address);
  const [addressType, setAddressType] = useState<"saved" | "new">("saved");

  const hasFastingTest = booking.tests.some((test) => test.fastingRequired);

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  const canProceed = selectedDate && selectedSlot && selectedAddress;

  const handleProceed = () => {
    onUpdate({
      date: selectedDate,
      timeSlot: selectedSlot,
      address: selectedAddress,
    });
    onProceed();
  };

  return (
    <div className="px-4 py-6 space-y-6 pb-32">
      {/* Fasting Reminder */}
      {hasFastingTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/30 rounded-xl p-4"
        >
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Morning Slots Recommended</p>
              <p className="text-sm text-muted-foreground">
                Your tests require fasting. We recommend early morning slots (6-10 AM) for accurate results.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Date Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Select Date</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {availableDates.map((date) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[70px] p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <span className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {format(date, "EEE")}
                </span>
                <span className="text-xl font-bold">{format(date, "d")}</span>
                <span className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {format(date, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Select Time Slot</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`relative p-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <span className={`text-sm font-medium ${isSelected ? "" : "text-foreground"}`}>
                  {slot.label}
                </span>
                {slot.recommended && hasFastingTest && (
                  <span className={`block text-xs mt-0.5 ${isSelected ? "text-primary-foreground/80" : "text-success"}`}>
                    Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Address Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Collection Address</h2>
        </div>

        <RadioGroup value={addressType} onValueChange={(v) => setAddressType(v as "saved" | "new")}>
          <div className="space-y-3">
            {/* Saved Addresses */}
            {savedAddresses.map((addr) => {
              const Icon = addr.icon;
              const isSelected = addressType === "saved" && selectedAddress === addr.address;
              return (
                <Card
                  key={addr.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setAddressType("saved");
                    setSelectedAddress(addr.address);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="saved" id={addr.id} className="mt-1" checked={isSelected} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{addr.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* New Address */}
            <Card
              className={`cursor-pointer transition-all ${
                addressType === "new" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setAddressType("new")}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="new" id="new-address" className="mt-1" />
                  <div className="flex-1 space-y-3">
                    <Label htmlFor="new-address" className="font-medium text-foreground cursor-pointer">
                      Add New Address
                    </Label>
                    {addressType === "new" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <Input
                          placeholder="Enter complete address with landmark"
                          value={selectedAddress === savedAddresses[0].address || selectedAddress === savedAddresses[1].address ? "" : selectedAddress}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-2"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      {/* Proceed Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4"
      >
        <Button
          onClick={handleProceed}
          disabled={!canProceed}
          className="w-full h-12 rounded-xl text-base"
        >
          Confirm Schedule
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ScheduleCollection;
