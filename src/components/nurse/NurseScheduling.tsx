import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, Shield, IndianRupee, Plus, Minus } from "lucide-react";
import type { SelectedNurse, SelectedService, NurseBookingDetails } from "@/pages/PartTimeNurse";

const timeSlots = {
  morning: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
  afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  evening: ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
};

interface NurseSchedulingProps {
  nurse: SelectedNurse;
  services: SelectedService[];
  booking: NurseBookingDetails;
  onUpdate: (updates: Partial<NurseBookingDetails>) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const NurseScheduling = ({
  nurse,
  services,
  booking,
  onUpdate,
  onConfirm,
  onBack,
}: NurseSchedulingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onUpdate({ date: date.toISOString() });
    }
  };

  const calculateTotal = () => {
    const baseRate = services.reduce((sum, service) => {
      return sum + (booking.bookingType === "hourly" ? service.pricePerHour : service.pricePerDay);
    }, 0);

    const multiplier = booking.bookingType === "hourly" ? (booking.hours || 2) : (booking.days || 1);
    return baseRate * multiplier;
  };

  const totalAmount = calculateTotal();

  const adjustQuantity = (type: "increase" | "decrease") => {
    if (booking.bookingType === "hourly") {
      const current = booking.hours || 2;
      const newValue = type === "increase" ? Math.min(current + 1, 12) : Math.max(current - 1, 1);
      onUpdate({ hours: newValue, totalAmount: calculateTotal() });
    } else {
      const current = booking.days || 1;
      const newValue = type === "increase" ? Math.min(current + 1, 30) : Math.max(current - 1, 1);
      onUpdate({ days: newValue, totalAmount: calculateTotal() });
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Nurse Mini Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={nurse.image}
              alt={nurse.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            {nurse.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{nurse.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{nurse.rating}</span>
              <span>•</span>
              <span>{nurse.experience}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Type Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">Booking Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {["hourly", "daily"].map((type) => (
            <button
              key={type}
              onClick={() => onUpdate({ bookingType: type as "hourly" | "daily" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                booking.bookingType === type
                  ? "border-service-nurse bg-service-nurse/5"
                  : "border-border bg-card"
              }`}
            >
              <Clock className={`w-6 h-6 mb-2 ${
                booking.bookingType === type ? "text-service-nurse" : "text-muted-foreground"
              }`} />
              <p className="font-semibold text-foreground capitalize">{type}</p>
              <p className="text-sm text-muted-foreground">
                {type === "hourly" ? "Minimum 1 hour" : "8 hours/day"}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Duration Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">
          {booking.bookingType === "hourly" ? "Hours Needed" : "Days Needed"}
        </h3>
        <div className="flex items-center justify-center gap-6 bg-card border border-border rounded-xl p-4">
          <button
            onClick={() => adjustQuantity("decrease")}
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-4xl font-bold text-foreground">
              {booking.bookingType === "hourly" ? booking.hours : booking.days}
            </span>
            <p className="text-sm text-muted-foreground">
              {booking.bookingType === "hourly" ? "hours" : "days"}
            </p>
          </div>
          <button
            onClick={() => adjustQuantity("increase")}
            className="w-12 h-12 rounded-full bg-service-nurse text-white flex items-center justify-center hover:bg-service-nurse/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Date Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">Select Start Date</h3>
        <div className="bg-card border border-border rounded-xl p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            className="rounded-md"
          />
        </div>
      </motion.div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-base font-semibold text-foreground mb-3">Select Start Time</h3>
          
          {Object.entries(timeSlots).map(([period, slots]) => (
            <div key={period} className="mb-4">
              <p className="text-sm text-muted-foreground mb-2 capitalize">{period}</p>
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onUpdate({ timeSlot: slot })}
                    className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                      booking.timeSlot === slot
                        ? "bg-service-nurse text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">Service Address</h3>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-service-nurse/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-service-nurse" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Home</p>
              <p className="text-sm text-muted-foreground">
                42, Lotus Apartments, Sector 15, Noida, UP - 201301
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-service-nurse/10 rounded-xl p-4 mb-6"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">Price Summary</h3>
        <div className="space-y-2">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{service.name}</span>
              <span className="text-foreground">
                ₹{booking.bookingType === "hourly" ? service.pricePerHour : service.pricePerDay}
                /{booking.bookingType === "hourly" ? "hr" : "day"}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-foreground">
              {booking.bookingType === "hourly" ? `${booking.hours} hours` : `${booking.days} day(s)`}
            </span>
          </div>
          <div className="border-t border-service-nurse/20 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-service-nurse flex items-center">
                <IndianRupee className="w-4 h-4" />
                {totalAmount}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirm Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="sticky bottom-24 bg-background pt-4"
      >
        <Button
          onClick={() => {
            onUpdate({ totalAmount });
            onConfirm();
          }}
          disabled={!selectedDate || !booking.timeSlot}
          className="w-full h-14 text-base font-semibold bg-service-nurse hover:bg-service-nurse/90"
        >
          Confirm Booking • ₹{totalAmount}
        </Button>
      </motion.div>
    </div>
  );
};

export default NurseScheduling;
