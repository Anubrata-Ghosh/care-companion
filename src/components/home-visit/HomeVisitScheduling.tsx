import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User,
  FileText,
  Star,
  Shield,
  Home,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { HomeVisitDoctor, HomeVisitBookingDetails } from "@/pages/DoctorHomeVisit";

interface HomeVisitSchedulingProps {
  doctor: HomeVisitDoctor;
  booking: HomeVisitBookingDetails;
  onUpdate: (updates: Partial<HomeVisitBookingDetails>) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const timeSlots = {
  morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
  afternoon: ["12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  evening: ["5:00 PM", "6:00 PM", "7:00 PM"],
};

const HomeVisitScheduling = ({ doctor, booking, onUpdate, onConfirm, onBack }: HomeVisitSchedulingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onUpdate({ date: date.toISOString(), timeSlot: "" });
    }
    setShowCalendar(false);
  };

  const isFormComplete = 
    booking.date && 
    booking.timeSlot && 
    booking.address && 
    booking.patientName;

  return (
    <div className="px-4 space-y-4 pb-6">
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
          <h1 className="text-xl font-bold text-foreground">Schedule Visit</h1>
          <p className="text-sm text-muted-foreground">Fill in details for home visit</p>
        </div>
      </motion.div>

      {/* Doctor Mini Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-service-home-visit-light to-warning-light border border-service-home-visit/20"
      >
        <div className="flex items-center gap-3">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{doctor.name}</h3>
              {doctor.verified && (
                <Shield className="w-4 h-4 text-success" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{doctor.specialty || "General Physician"}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-xs font-medium">{doctor.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{doctor.experience} exp</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-service-home-visit">₹{doctor.visitFee}</span>
            <p className="text-xs text-muted-foreground">Fixed fee</p>
          </div>
        </div>
      </motion.div>

      {/* Date Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          Select Date
        </h2>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full p-4 rounded-xl bg-card border border-border/50 flex items-center justify-between"
        >
          <span className={selectedDate ? "text-foreground font-medium" : "text-muted-foreground"}>
            {selectedDate 
              ? selectedDate.toLocaleDateString("en-IN", { 
                  weekday: "long", 
                  day: "numeric", 
                  month: "long" 
                })
              : "Choose a date"
            }
          </span>
          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${showCalendar ? "rotate-90" : ""}`} />
        </button>

        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-2xl bg-card border border-border/50 p-3 overflow-hidden"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              className="rounded-xl"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Time Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Select Time Slot
          </h2>
          
          {Object.entries(timeSlots).map(([period, slots]) => (
            <div key={period} className="space-y-2">
              <span className="text-sm text-muted-foreground capitalize">{period}</span>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onUpdate({ timeSlot: slot })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      booking.timeSlot === slot
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-primary/10"
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

      {/* Patient Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Patient Details
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Patient Name"
            value={booking.patientName}
            onChange={(e) => onUpdate({ patientName: e.target.value })}
            className="h-12 rounded-xl"
          />
          <Input
            placeholder="Age"
            value={booking.patientAge}
            onChange={(e) => onUpdate({ patientAge: e.target.value })}
            className="h-12 rounded-xl"
          />
        </div>
      </motion.div>

      {/* Symptoms */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Symptoms (Optional)
        </h2>
        <Textarea
          placeholder="Describe symptoms or reason for visit..."
          value={booking.symptoms}
          onChange={(e) => onUpdate({ symptoms: e.target.value })}
          className="rounded-xl resize-none"
          rows={3}
        />
      </motion.div>

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Visit Address
        </h2>
        <Input
          placeholder="Full address"
          value={booking.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          className="h-12 rounded-xl"
        />
        <Input
          placeholder="Landmark (optional)"
          value={booking.landmark}
          onChange={(e) => onUpdate({ landmark: e.target.value })}
          className="h-12 rounded-xl"
        />
      </motion.div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-4 rounded-2xl bg-card border border-border/50 space-y-3"
      >
        <h3 className="font-semibold text-foreground">Price Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Doctor Visit Fee</span>
            <span className="font-medium">₹{doctor.visitFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium text-success">FREE</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total Amount</span>
            <span className="text-xl font-bold text-primary">₹{doctor.visitFee}</span>
          </div>
        </div>
      </motion.div>

      {/* Confirm Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={onConfirm}
          disabled={!isFormComplete}
          className="w-full h-14 rounded-2xl bg-service-home-visit hover:bg-service-home-visit/90 text-lg font-semibold disabled:opacity-50"
        >
          <Home className="w-5 h-5 mr-2" />
          Confirm Home Visit
        </Button>
      </motion.div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-center text-xs text-muted-foreground"
      >
        By confirming, you agree to our terms. Payment will be collected by the doctor.
      </motion.div>
    </div>
  );
};

export default HomeVisitScheduling;
