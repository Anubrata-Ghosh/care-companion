import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import NurseServiceSelection from "@/components/nurse/NurseServiceSelection";
import NurseList from "@/components/nurse/NurseList";
import NurseScheduling from "@/components/nurse/NurseScheduling";
import NurseConfirmation from "@/components/nurse/NurseConfirmation";

export type BookingStep = "services" | "nurses" | "schedule" | "confirmation";

export interface SelectedService {
  id: string;
  name: string;
  icon: string;
  pricePerHour: number;
  pricePerDay: number;
}

export interface SelectedNurse {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: string;
  specializations: string[];
  languages: string[];
  verified: boolean;
  totalBookings: number;
}

export interface NurseBookingDetails {
  services: SelectedService[];
  nurse: SelectedNurse | null;
  bookingType: "hourly" | "daily";
  hours?: number;
  days?: number;
  date: string;
  timeSlot: string;
  address: string;
  totalAmount: number;
  bookingId?: string;
}

const PartTimeNurse = () => {
  const [step, setStep] = useState<BookingStep>("services");
  const [booking, setBooking] = useState<NurseBookingDetails>({
    services: [],
    nurse: null,
    bookingType: "hourly",
    hours: 2,
    days: 1,
    date: "",
    timeSlot: "",
    address: "",
    totalAmount: 0,
  });

  const updateBooking = (updates: Partial<NurseBookingDetails>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (newStep: BookingStep) => {
    setStep(newStep);
  };

  const getStepTitle = () => {
    switch (step) {
      case "services":
        return "Select Services";
      case "nurses":
        return "Choose Nurse";
      case "schedule":
        return "Schedule Booking";
      case "confirmation":
        return "Booking Confirmed";
      default:
        return "Part-time Nurse";
    }
  };

  const handleBack = () => {
    switch (step) {
      case "nurses":
        goToStep("services");
        break;
      case "schedule":
        goToStep("nurses");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      {/* Step Header */}
      {step !== "confirmation" && (
        <div className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            {step !== "services" && (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-semibold text-foreground">
              {getStepTitle()}
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mt-3">
            {["services", "nurses", "schedule"].map((s, index) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ["services", "nurses", "schedule"].indexOf(step) >= index
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === "services" && (
            <NurseServiceSelection
              selectedServices={booking.services}
              onUpdate={(services) => updateBooking({ services })}
              onContinue={() => goToStep("nurses")}
            />
          )}

          {step === "nurses" && (
            <NurseList
              selectedServices={booking.services}
              onSelect={(nurse) => {
                updateBooking({ nurse });
                goToStep("schedule");
              }}
              onBack={() => goToStep("services")}
            />
          )}

          {step === "schedule" && booking.nurse && (
            <NurseScheduling
              nurse={booking.nurse}
              services={booking.services}
              booking={booking}
              onUpdate={updateBooking}
              onConfirm={() => {
                const bookingId = `NRS${Date.now().toString().slice(-8)}`;
                updateBooking({ bookingId });
                goToStep("confirmation");
              }}
              onBack={() => goToStep("nurses")}
            />
          )}

          {step === "confirmation" && (
            <NurseConfirmation booking={booking} />
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default PartTimeNurse;
