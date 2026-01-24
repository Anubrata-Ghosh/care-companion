import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import CarePackageSelection from "@/components/elderly-care/CarePackageSelection";
import CaregiverList from "@/components/elderly-care/CaregiverList";
import CarePlanCustomization from "@/components/elderly-care/CarePlanCustomization";
import ElderlyCareConfirmation from "@/components/elderly-care/ElderlyCareConfirmation";

type BookingStep = "packages" | "caregivers" | "customize" | "confirmation";

export interface CarePackage {
  id: string;
  name: string;
  type: "daily" | "monthly";
  price: number;
  duration: string;
  features: string[];
}

export interface Caregiver {
  id: string;
  name: string;
  age: number;
  experience: number;
  rating: number;
  reviews: number;
  specializations: string[];
  languages: string[];
  image: string;
  verified: boolean;
  gender: string;
}

export interface CarePlan {
  medications: boolean;
  mobility: boolean;
  bathing: boolean;
  feeding: boolean;
  companionship: boolean;
  exercises: boolean;
  vitals: boolean;
  nightCare: boolean;
}

export interface ElderlyDetails {
  name: string;
  age: string;
  conditions: string;
  address: string;
  emergencyContact: string;
  startDate: Date | undefined;
}

export interface ElderlyCareBooking {
  package: CarePackage | null;
  caregiver: Caregiver | null;
  carePlan: CarePlan;
  elderlyDetails: ElderlyDetails;
}

const ElderlyCare = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<BookingStep>("packages");
  const [booking, setBooking] = useState<ElderlyCareBooking>({
    package: null,
    caregiver: null,
    carePlan: {
      medications: true,
      mobility: true,
      bathing: false,
      feeding: false,
      companionship: true,
      exercises: false,
      vitals: true,
      nightCare: false,
    },
    elderlyDetails: {
      name: "",
      age: "",
      conditions: "",
      address: "",
      emergencyContact: "",
      startDate: undefined,
    },
  });

  const updateBooking = (updates: Partial<ElderlyCareBooking>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (newStep: BookingStep) => {
    setStep(newStep);
  };

  const getStepTitle = () => {
    switch (step) {
      case "packages":
        return "Care Packages";
      case "caregivers":
        return "Select Caregiver";
      case "customize":
        return "Customize Care Plan";
      case "confirmation":
        return "Booking Confirmed";
    }
  };

  const handleBack = () => {
    switch (step) {
      case "packages":
        navigate(-1);
        break;
      case "caregivers":
        setStep("packages");
        break;
      case "customize":
        setStep("caregivers");
        break;
      case "confirmation":
        navigate("/");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        {/* Step Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">{getStepTitle()}</h1>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === "packages" && (
              <CarePackageSelection
                selectedPackage={booking.package}
                onSelectPackage={(pkg) => {
                  updateBooking({ package: pkg });
                  goToStep("caregivers");
                }}
              />
            )}

            {step === "caregivers" && (
              <CaregiverList
                onSelectCaregiver={(caregiver) => {
                  updateBooking({ caregiver });
                  goToStep("customize");
                }}
              />
            )}

            {step === "customize" && (
              <CarePlanCustomization
                booking={booking}
                onUpdateBooking={updateBooking}
                onConfirm={() => goToStep("confirmation")}
              />
            )}

            {step === "confirmation" && (
              <ElderlyCareConfirmation booking={booking} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default ElderlyCare;
