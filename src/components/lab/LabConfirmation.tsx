import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, MapPin, User, FileText, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { LabBooking } from "@/pages/LabTests";

interface LabConfirmationProps {
  booking: LabBooking;
  onTrackReports: () => void;
}

const getTimeSlotLabel = (slotId: string) => {
  const slots: Record<string, string> = {
    "6-8am": "6:00 - 8:00 AM",
    "8-10am": "8:00 - 10:00 AM",
    "10-12pm": "10:00 AM - 12:00 PM",
    "12-2pm": "12:00 - 2:00 PM",
    "2-4pm": "2:00 - 4:00 PM",
    "4-6pm": "4:00 - 6:00 PM",
  };
  return slots[slotId] || slotId;
};

const LabConfirmation = ({ booking, onTrackReports }: LabConfirmationProps) => {
  const totalAmount = booking.tests.reduce((sum, t) => sum + (t.discountPrice || t.price), 0);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="relative mb-6"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-success/20"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center relative">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your home sample collection is scheduled</p>
        </motion.div>
      </motion.div>

      {/* Booking ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
            <p className="text-2xl font-bold text-primary font-mono">{booking.bookingId}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Collection Details</h3>
            
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {booking.date ? format(booking.date, "EEEE, d MMMM yyyy") : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-medium text-foreground">{getTimeSlotLabel(booking.timeSlot)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{booking.address}</p>
                </div>
              </div>

              {booking.technician && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technician</p>
                    <p className="font-medium text-foreground">{booking.technician.name}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tests Booked */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Tests Booked ({booking.tests.length})</h3>
            </div>
            <div className="space-y-2">
              {booking.tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-sm">{test.name}</p>
                    <p className="text-xs text-muted-foreground">Report in {test.reportTime}</p>
                  </div>
                  <span className="font-medium text-foreground">₹{test.discountPrice || test.price}</span>
                </div>
              ))}
              <div className="pt-2 flex items-center justify-between font-semibold">
                <span className="text-foreground">Total Paid</span>
                <span className="text-primary text-lg">₹{totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-accent/30 rounded-xl p-4"
      >
        <h3 className="font-semibold text-foreground mb-2">📋 Report Timeline</h3>
        <p className="text-sm text-muted-foreground">
          Your digital reports will be available within 24-48 hours after sample collection. 
          We'll notify you via SMS and app notification.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <Button onClick={onTrackReports} className="w-full h-12 rounded-xl text-base">
          <FileText className="h-5 w-5 mr-2" />
          Track Reports
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LabConfirmation;
