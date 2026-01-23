import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Ambulance, Hospital, Star, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { EmergencyDetails } from "@/pages/EmergencySOS";

interface EmergencyResolvedProps {
  emergency: EmergencyDetails;
  onClose: () => void;
}

const EmergencyResolved = ({ emergency, onClose }: EmergencyResolvedProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex flex-col px-4 py-8">
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Emergency Resolved</h1>
        <p className="text-muted-foreground text-center">
          We're glad you're safe. Here's a summary of the response.
        </p>
      </motion.div>

      {/* Emergency ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-green-100 rounded-xl p-4 mb-6 text-center"
      >
        <p className="text-sm text-muted-foreground mb-1">Emergency ID</p>
        <p className="text-xl font-bold text-green-700 tracking-wide">{emergency.id}</p>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-4 mb-4"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Response Summary</h3>

        <div className="space-y-4">
          {/* Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {format(emergency.triggeredAt, "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                Triggered at {format(emergency.triggeredAt, "h:mm a")}
              </p>
            </div>
          </div>

          {/* Ambulance */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Ambulance className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">{emergency.vehicleNumber}</p>
              <p className="text-sm text-muted-foreground">
                Driver: {emergency.driverName}
              </p>
            </div>
          </div>

          {/* Hospital */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Hospital className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">{emergency.hospitalName}</p>
              <p className="text-sm text-muted-foreground">{emergency.hospitalAddress}</p>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Response Time</p>
              <p className="text-sm text-muted-foreground">
                Ambulance reached in {emergency.ambulanceEta} minutes
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rate Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-4 mb-4"
      >
        <h3 className="text-sm font-medium text-foreground mb-3">Rate Your Experience</h3>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="p-2 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Your feedback helps us improve
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <Button variant="outline" className="h-12">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline" className="h-12">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </motion.div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
      >
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Safety Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep emergency contacts updated in your profile</li>
          <li>• Share your live location with family during travel</li>
          <li>• Learn basic first aid for common emergencies</li>
          <li>• Keep a first aid kit at home and in your car</li>
        </ul>
      </motion.div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={onClose}
          className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700"
        >
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default EmergencyResolved;
