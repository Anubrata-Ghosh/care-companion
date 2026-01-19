import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Video, MapPin, Calendar as CalendarIcon, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { SelectedDoctor, BookingDetails } from "@/pages/DoctorAppointment";
import { format, addDays } from "date-fns";

interface TimeSlotPickerProps {
  doctor: SelectedDoctor;
  booking: BookingDetails;
  onUpdate: (updates: Partial<BookingDetails>) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const timeSlots = {
  morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  afternoon: ["12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
  evening: ["4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"],
};

const unavailableSlots = ["10:00 AM", "2:30 PM", "5:00 PM"];

const TimeSlotPicker = ({ doctor, booking, onUpdate, onConfirm, onBack }: TimeSlotPickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onUpdate({ date, timeSlot: "" });
    }
  };

  const handleTimeSelect = (time: string) => {
    onUpdate({ timeSlot: time });
  };

  const isSlotAvailable = (slot: string) => !unavailableSlots.includes(slot);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Select Date & Time</h1>
          <p className="text-sm text-muted-foreground">Choose your preferred slot</p>
        </div>
      </div>

      {/* Doctor Card Mini */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-4"
        >
          <div className="flex gap-3">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-sm font-medium">{doctor.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fee</p>
              <p className="font-bold text-primary">₹{doctor.consultationFee}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Consultation Type Toggle */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary rounded-2xl p-1.5 flex gap-1.5"
        >
          <button
            onClick={() => onUpdate({ consultationType: "in-person" })}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
              booking.consultationType === "in-person"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <MapPin className="w-4 h-4" />
            In-Person Visit
          </button>
          <button
            onClick={() => onUpdate({ consultationType: "video" })}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
              booking.consultationType === "video"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Video className="w-4 h-4" />
            Video Consult
          </button>
        </motion.div>
      </div>

      {/* Calendar */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl border border-border/50 p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Select Date</h3>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-xl pointer-events-auto"
          />
        </motion.div>
      </div>

      {/* Time Slots */}
      <div className="px-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Available Slots - {format(selectedDate, "EEE, MMM d")}
          </h3>
        </motion.div>

        {Object.entries(timeSlots).map(([period, slots], periodIndex) => (
          <motion.div
            key={period}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + periodIndex * 0.05 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-muted-foreground capitalize">{period}</p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const available = isSlotAvailable(slot);
                const selected = booking.timeSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => available && handleTimeSelect(slot)}
                    disabled={!available}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                      selected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : available
                        ? "bg-card border border-border hover:border-primary/50 text-foreground"
                        : "bg-muted text-muted-foreground cursor-not-allowed line-through"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onConfirm}
            disabled={!booking.timeSlot}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            Confirm Booking
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
