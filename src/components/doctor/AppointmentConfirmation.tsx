import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, MapPin, Video, Phone, MessageCircle, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDetails } from "@/pages/DoctorAppointment";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCreateBooking } from "@/hooks/useCreateBooking";

interface AppointmentConfirmationProps {
  booking: BookingDetails;
  onBack: () => void;
}

const AppointmentConfirmation = ({ booking }: AppointmentConfirmationProps) => {
  const navigate = useNavigate();
  const { createBooking } = useCreateBooking();
  const bookingId = `CN${Date.now().toString().slice(-8)}`;
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const saveBooking = async () => {
      if (!booking.doctor || !booking.date) return;

      await createBooking({
        bookingType: "doctor",
        title: `${booking.consultationType === "video" ? "Video" : "In-Person"} Consultation`,
        providerName: booking.doctor.name,
        bookingDate: format(booking.date, "yyyy-MM-dd"),
        bookingTime: booking.timeSlot,
        amount: booking.doctor.consultationFee,
        location: booking.nursingHome?.address || "Video Consultation",
        notes: `Specialty: ${booking.doctor.specialty}`,
      });
    };

    saveBooking();
  }, []);

  return (
    <div className="px-4 space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center pt-8"
      >
        <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2 className="w-14 h-14 text-success" />
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-center mt-1">
          Your appointment has been scheduled
        </p>
      </motion.div>

      {/* Booking ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-primary/10 rounded-2xl p-4 text-center"
      >
        <p className="text-sm text-muted-foreground">Booking ID</p>
        <p className="text-xl font-bold text-primary tracking-wider">{bookingId}</p>
      </motion.div>

      {/* Appointment Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm"
      >
        {/* Doctor Info */}
        {booking.doctor && (
          <div className="p-4 border-b border-border/50">
            <div className="flex gap-4">
              <img
                src={booking.doctor.image}
                alt={booking.doctor.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-foreground">{booking.doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{booking.doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{booking.doctor.qualification}</p>
              </div>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {booking.date ? format(booking.date, "EEEE, MMMM d, yyyy") : "Not selected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">{booking.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              booking.consultationType === "video" ? "bg-info/10" : "bg-accent/10"
            }`}>
              {booking.consultationType === "video" ? (
                <Video className="w-5 h-5 text-info" />
              ) : (
                <MapPin className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consultation Type</p>
              <p className="font-medium text-foreground">
                {booking.consultationType === "video" ? "Video Consultation" : "In-Person Visit"}
              </p>
            </div>
          </div>

          {booking.nursingHome && booking.consultationType === "in-person" && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{booking.nursingHome.name}</p>
                <p className="text-sm text-muted-foreground">{booking.nursingHome.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Fee Summary */}
        <div className="p-4 bg-secondary/50 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Consultation Fee</span>
            <span className="font-bold text-lg text-foreground">
              ₹{booking.doctor?.consultationFee}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-3"
      >
        <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
          <Download className="w-5 h-5 mb-1" />
          <span className="text-xs">Download</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Chat</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-xs">Call</span>
        </Button>
      </motion.div>

      {/* Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-warning/10 rounded-2xl p-4"
      >
        <p className="text-sm text-warning font-medium mb-1">📋 Before your visit</p>
        <p className="text-sm text-muted-foreground">
          Please carry your ID proof and any previous medical reports.
          Arrive 10 minutes early for in-person consultations.
        </p>
      </motion.div>

      {/* Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="pb-4"
      >
        <Button
          onClick={() => navigate("/")}
          className="w-full h-14 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default AppointmentConfirmation;
