import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  User,
  Shield,
  Heart,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { ElderlyCareBooking } from "@/pages/ElderlyCare";
import { useCreateBooking } from "@/hooks/useCreateBooking";

interface ElderlyCareConfirmationProps {
  booking: ElderlyCareBooking;
}

const ElderlyCareConfirmation = ({ booking }: ElderlyCareConfirmationProps) => {
  const navigate = useNavigate();
  const { createBooking } = useCreateBooking();
  const hasSavedRef = useRef(false);
  const { caregiver, package: selectedPackage, carePlan, elderlyDetails } = booking;

  const bookingId = `EC${Date.now().toString().slice(-8)}`;

  // Calculate selected services
  const selectedServices = Object.entries(carePlan)
    .filter(([_, value]) => value)
    .map(([key]) => {
      const labels: Record<string, string> = {
        medications: "Medication Management",
        mobility: "Mobility Assistance",
        bathing: "Bathing & Grooming",
        feeding: "Meal & Feeding",
        companionship: "Companionship",
        exercises: "Light Exercises",
        vitals: "Vitals Monitoring",
        nightCare: "Night Care",
      };
      return labels[key];
    });

  const basePrice = selectedPackage?.price || 0;
  const nightCareExtra =
    carePlan.nightCare && selectedPackage?.type === "daily" ? 500 : 0;
  const totalPrice = basePrice + nightCareExtra;

  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const saveBooking = async () => {
      if (!elderlyDetails.startDate || !caregiver) return;

      await createBooking({
        bookingType: "elderly-care",
        title: `Elderly Care - ${selectedPackage?.name || "Care Package"}`,
        providerName: caregiver.name,
        bookingDate: format(elderlyDetails.startDate, "yyyy-MM-dd"),
        bookingTime: selectedPackage?.duration || "Full Day",
        amount: totalPrice,
        location: elderlyDetails.address,
        notes: `Patient: ${elderlyDetails.name}, Age: ${elderlyDetails.age}. Services: ${selectedServices.join(", ")}`,
      });
    };

    saveBooking();
  }, []);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground text-sm">
          Your elderly care service has been scheduled
        </p>
        <Badge variant="outline" className="mt-2">
          Booking ID: {bookingId}
        </Badge>
      </motion.div>

      {/* Caregiver Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {caregiver?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold">{caregiver?.name}</h3>
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {caregiver?.experience} years experience
                </p>
                <p className="text-xs text-muted-foreground">
                  {caregiver?.languages.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = "tel:+919876543210")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Service Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Patient</p>
                  <p className="text-muted-foreground">
                    {elderlyDetails.name}, {elderlyDetails.age} years
                  </p>
                  {elderlyDetails.conditions && (
                    <p className="text-xs text-muted-foreground">
                      Conditions: {elderlyDetails.conditions}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-muted-foreground">
                    {elderlyDetails.startDate &&
                      format(elderlyDetails.startDate, "EEEE, dd MMMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{selectedPackage?.name}</p>
                  <p className="text-muted-foreground">
                    {selectedPackage?.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Care Address</p>
                  <p className="text-muted-foreground">
                    {elderlyDetails.address}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-primary" />
              Care Plan Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service) => (
                <Badge key={service} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{totalPrice.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{selectedPackage?.type === "daily" ? "day" : "month"}
                  </span>
                </p>
              </div>
              <Badge className="bg-green-500">Confirmed</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3"
      >
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="p-4">
            <h4 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-200 mb-2">
              <AlertCircle className="w-4 h-4" />
              Important Notes
            </h4>
            <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Caregiver will arrive 15 minutes before scheduled time</li>
              <li>• Please keep medical records and prescriptions ready</li>
              <li>• 24/7 helpline available for any emergencies</li>
              <li>• Flexible rescheduling with 24-hour notice</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Back to Home */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default ElderlyCareConfirmation;
