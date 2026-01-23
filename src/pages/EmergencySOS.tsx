import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EmergencyTrigger from "@/components/emergency/EmergencyTrigger";
import EmergencyActive from "@/components/emergency/EmergencyActive";
import EmergencyResolved from "@/components/emergency/EmergencyResolved";

export type EmergencyStep = "trigger" | "active" | "resolved";

export interface EmergencyDetails {
  id: string;
  triggeredAt: Date;
  ambulanceEta: number; // minutes
  ambulanceDistance: number; // km
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhone: string;
  userLocation: { lat: number; lng: number };
  ambulanceLocation: { lat: number; lng: number };
}

const EmergencySOS = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<EmergencyStep>("trigger");
  const [emergency, setEmergency] = useState<EmergencyDetails | null>(null);

  const handleTriggerEmergency = () => {
    // Simulate emergency dispatch
    const emergencyData: EmergencyDetails = {
      id: `EMR${Date.now().toString().slice(-8)}`,
      triggeredAt: new Date(),
      ambulanceEta: 8,
      ambulanceDistance: 2.4,
      driverName: "Rajesh Kumar",
      driverPhone: "+91 98765 43210",
      vehicleNumber: "DL 01 AB 1234",
      hospitalName: "Max Super Specialty Hospital",
      hospitalAddress: "Sector 19, Noida, UP",
      hospitalPhone: "+91 120 4567890",
      doctorName: "Dr. Anil Sharma",
      doctorSpecialty: "Emergency Medicine",
      doctorPhone: "+91 98765 12345",
      userLocation: { lat: 28.5355, lng: 77.391 },
      ambulanceLocation: { lat: 28.5455, lng: 77.401 },
    };
    setEmergency(emergencyData);
    setStep("active");
  };

  const handleResolve = () => {
    setStep("resolved");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === "trigger" && (
            <EmergencyTrigger
              onTrigger={handleTriggerEmergency}
              onBack={handleClose}
            />
          )}

          {step === "active" && emergency && (
            <EmergencyActive
              emergency={emergency}
              onResolve={handleResolve}
            />
          )}

          {step === "resolved" && emergency && (
            <EmergencyResolved
              emergency={emergency}
              onClose={handleClose}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EmergencySOS;
