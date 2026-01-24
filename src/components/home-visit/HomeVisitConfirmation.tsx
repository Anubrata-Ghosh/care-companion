import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageCircle,
  Share2,
  Download,
  Home,
  Star,
  Shield,
  Stethoscope,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeVisitBookingDetails } from "@/pages/DoctorHomeVisit";

interface HomeVisitConfirmationProps {
  booking: HomeVisitBookingDetails;
}

const HomeVisitConfirmation = ({ booking }: HomeVisitConfirmationProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 space-y-5 pb-8">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="flex flex-col items-center py-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="w-12 h-12 text-success" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-foreground text-center"
        >
          Home Visit Scheduled!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-center mt-2"
        >
          Your doctor will arrive at the scheduled time
        </motion.p>
      </motion.div>

      {/* Booking ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-2xl bg-service-home-visit-light border border-service-home-visit/20 text-center"
      >
        <span className="text-sm text-service-home-visit">Booking ID</span>
        <p className="text-xl font-bold text-service-home-visit mt-1">
          {booking.bookingId}
        </p>
      </motion.div>

      {/* Doctor Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="p-4 rounded-2xl bg-card border border-border/50"
      >
        <div className="flex items-center gap-4">
          <img
            src={booking.doctor?.image}
            alt={booking.doctor?.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{booking.doctor?.name}</h3>
              {booking.doctor?.verified && (
                <Shield className="w-4 h-4 text-success" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {booking.doctor?.specialty || "General Physician"}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-xs font-medium">{booking.doctor?.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {booking.doctor?.experience} experience
              </span>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="outline" className="h-12 rounded-xl">
            <Phone className="w-4 h-4 mr-2" />
            Call Doctor
          </Button>
          <Button variant="outline" className="h-12 rounded-xl">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </motion.div>

      {/* Appointment Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-2xl bg-card border border-border/50 space-y-4"
      >
        <h3 className="font-semibold text-foreground">Visit Details</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Date</span>
              <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Time Slot</span>
              <p className="font-medium text-foreground">{booking.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Patient</span>
              <p className="font-medium text-foreground">
                {booking.patientName}
                {booking.patientAge && `, ${booking.patientAge} years`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Visit Address</span>
              <p className="font-medium text-foreground">{booking.address}</p>
              {booking.landmark && (
                <p className="text-xs text-muted-foreground mt-1">
                  Landmark: {booking.landmark}
                </p>
              )}
            </div>
          </div>

          {booking.symptoms && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Symptoms</span>
                <p className="font-medium text-foreground">{booking.symptoms}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="p-4 rounded-2xl bg-card border border-border/50"
      >
        <h3 className="font-semibold text-foreground mb-3">Payment</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-muted-foreground">Total Amount</span>
            <p className="text-xs text-muted-foreground">To be paid to doctor</p>
          </div>
          <span className="text-2xl font-bold text-primary">₹{booking.totalAmount}</span>
        </div>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-4 rounded-2xl bg-warning-light border border-warning/20 space-y-2"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          <h3 className="font-semibold text-warning-foreground">Important Notes</h3>
        </div>
        <ul className="text-sm text-warning-foreground space-y-1 ml-6 list-disc">
          <li>Keep your previous prescriptions ready</li>
          <li>Payment to be made directly to the doctor</li>
          <li>Doctor will call 15 mins before arrival</li>
          <li>Reschedule 2 hours before if needed</li>
        </ul>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button variant="outline" className="h-12 rounded-xl">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" className="h-12 rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </motion.div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={() => navigate("/")}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-semibold"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default HomeVisitConfirmation;
