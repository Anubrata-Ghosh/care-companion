import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, MapPin, Phone, Share2, Download, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { NurseBookingDetails } from "@/pages/PartTimeNurse";
import { format } from "date-fns";
import { useCreateBooking } from "@/hooks/useCreateBooking";

interface NurseConfirmationProps {
  booking: NurseBookingDetails;
}

const NurseConfirmation = ({ booking }: NurseConfirmationProps) => {
  const navigate = useNavigate();
  const { createBooking } = useCreateBooking();
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const saveBooking = async () => {
      if (!booking.date || !booking.nurse) return;

      const serviceNames = booking.services.map(s => s.name).join(", ");
      const duration = booking.bookingType === "hourly" 
        ? `${booking.hours} hour${(booking.hours || 0) > 1 ? "s" : ""}`
        : `${booking.days} day${(booking.days || 0) > 1 ? "s" : ""}`;
      
      await createBooking({
        bookingType: "nurse",
        title: `Nurse Service (${duration})`,
        providerName: booking.nurse.name,
        bookingDate: format(new Date(booking.date), "yyyy-MM-dd"),
        bookingTime: booking.timeSlot,
        amount: booking.totalAmount,
        location: booking.address || "42, Lotus Apartments, Sector 15, Noida",
        notes: `Services: ${serviceNames}`,
      });
    };

    saveBooking();
  }, []);

  return (
    <div className="px-4 py-6">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-center">
          Your nurse will arrive at the scheduled time
        </p>
      </motion.div>

      {/* Booking ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-service-nurse/10 rounded-xl p-4 mb-6 text-center"
      >
        <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
        <p className="text-xl font-bold text-service-nurse tracking-wide">
          {booking.bookingId}
        </p>
      </motion.div>

      {/* Nurse Details */}
      {booking.nurse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4 mb-4"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Assigned Nurse
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={booking.nurse.image}
                alt={booking.nurse.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              {booking.nurse.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{booking.nurse.name}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{booking.nurse.rating}</span>
                <span>•</span>
                <span>{booking.nurse.experience}</span>
              </div>
              <button className="flex items-center gap-1 text-sm text-service-nurse font-medium mt-1">
                <Phone className="w-4 h-4" />
                Call Nurse
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-4 mb-4"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Booking Details
        </h3>

        <div className="space-y-4">
          {/* Services */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Services</p>
            <div className="flex flex-wrap gap-2">
              {booking.services.map((service) => (
                <span
                  key={service.id}
                  className="px-3 py-1 bg-service-nurse/10 text-service-nurse rounded-full text-sm font-medium"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {booking.date ? format(new Date(booking.date), "EEEE, MMMM d, yyyy") : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                Starting at {booking.timeSlot}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {booking.bookingType === "hourly"
                  ? `${booking.hours} Hour${(booking.hours || 0) > 1 ? "s" : ""}`
                  : `${booking.days} Day${(booking.days || 0) > 1 ? "s" : ""}`}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {booking.bookingType} booking
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Home</p>
              <p className="text-sm text-muted-foreground">
                42, Lotus Apartments, Sector 15, Noida
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-4 mb-6"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Payment Summary
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Total Amount</span>
          <span className="text-xl font-bold text-service-nurse">
            ₹{booking.totalAmount}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Pay after service completion
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <Button variant="outline" className="h-12">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" className="h-12">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
      >
        <h3 className="text-sm font-semibold text-amber-800 mb-2">
          Important Notes
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Nurse will carry ID card for verification</li>
          <li>• You can reschedule up to 4 hours before appointment</li>
          <li>• Payment to be made after service completion</li>
          <li>• For emergencies, call our 24/7 helpline</li>
        </ul>
      </motion.div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={() => navigate("/")}
          className="w-full h-14 text-base font-semibold bg-service-nurse hover:bg-service-nurse/90"
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NurseConfirmation;
