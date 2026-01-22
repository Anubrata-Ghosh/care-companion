import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TestCatalog from "@/components/lab/TestCatalog";
import TestCart from "@/components/lab/TestCart";
import ScheduleCollection from "@/components/lab/ScheduleCollection";
import TechnicianAssignment from "@/components/lab/TechnicianAssignment";
import LabConfirmation from "@/components/lab/LabConfirmation";
import ReportStatus from "@/components/lab/ReportStatus";

export type LabStep = "catalog" | "cart" | "schedule" | "technician" | "confirmation" | "reports";

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  fastingRequired: boolean;
  reportTime: string;
  includes?: string[];
}

export interface LabBooking {
  tests: LabTest[];
  date: Date | null;
  timeSlot: string;
  address: string;
  technician: {
    name: string;
    photo: string;
    rating: number;
    experience: string;
  } | null;
  bookingId: string;
}

const LabTests = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LabStep>("catalog");
  const [booking, setBooking] = useState<LabBooking>({
    tests: [],
    date: null,
    timeSlot: "",
    address: "",
    technician: null,
    bookingId: "",
  });

  const handleBack = () => {
    const stepOrder: LabStep[] = ["catalog", "cart", "schedule", "technician", "confirmation", "reports"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    } else {
      navigate("/");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "catalog": return "Lab Tests";
      case "cart": return "Your Tests";
      case "schedule": return "Schedule Collection";
      case "technician": return "Technician Assigned";
      case "confirmation": return "Booking Confirmed";
      case "reports": return "Your Reports";
      default: return "Lab Tests";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{getStepTitle()}</h1>
        </div>

        {/* Progress */}
        {step !== "reports" && (
          <div className="px-4 pb-3">
            <div className="flex gap-1">
              {["catalog", "cart", "schedule", "technician", "confirmation"].map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    ["catalog", "cart", "schedule", "technician", "confirmation"].indexOf(step) >= i
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === "catalog" && (
            <TestCatalog
              selectedTests={booking.tests}
              onSelectTest={(test) => {
                const exists = booking.tests.find((t) => t.id === test.id);
                if (exists) {
                  setBooking((prev) => ({
                    ...prev,
                    tests: prev.tests.filter((t) => t.id !== test.id),
                  }));
                } else {
                  setBooking((prev) => ({
                    ...prev,
                    tests: [...prev.tests, test],
                  }));
                }
              }}
              onProceed={() => setStep("cart")}
            />
          )}

          {step === "cart" && (
            <TestCart
              tests={booking.tests}
              onRemoveTest={(testId) =>
                setBooking((prev) => ({
                  ...prev,
                  tests: prev.tests.filter((t) => t.id !== testId),
                }))
              }
              onProceed={() => setStep("schedule")}
            />
          )}

          {step === "schedule" && (
            <ScheduleCollection
              booking={booking}
              onUpdate={(updates) => setBooking((prev) => ({ ...prev, ...updates }))}
              onProceed={() => setStep("technician")}
            />
          )}

          {step === "technician" && (
            <TechnicianAssignment
              booking={booking}
              onUpdate={(updates) => setBooking((prev) => ({ ...prev, ...updates }))}
              onProceed={() => {
                setBooking((prev) => ({
                  ...prev,
                  bookingId: `LAB${Date.now().toString().slice(-8)}`,
                }));
                setStep("confirmation");
              }}
            />
          )}

          {step === "confirmation" && (
            <LabConfirmation
              booking={booking}
              onTrackReports={() => setStep("reports")}
            />
          )}

          {step === "reports" && (
            <ReportStatus booking={booking} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LabTests;
