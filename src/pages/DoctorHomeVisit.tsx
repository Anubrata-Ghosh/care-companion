import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import DoctorTypeSelection from "@/components/home-visit/DoctorTypeSelection";
import HomeVisitDoctorList from "@/components/home-visit/HomeVisitDoctorList";
import HomeVisitScheduling from "@/components/home-visit/HomeVisitScheduling";
import HomeVisitConfirmation from "@/components/home-visit/HomeVisitConfirmation";

export type BookingStep = "doctor-type" | "doctors" | "schedule" | "confirmation";

export interface HomeVisitDoctor {
  id: string;
  name: string;
  type: "GP" | "Specialist";
  specialty?: string;
  qualification: string;
  experience: string;
  rating: number;
  reviewCount: number;
  visitFee: number;
  image: string;
  languages: string[];
  verified: boolean;
}

export interface HomeVisitBookingDetails {
  doctorType: "GP" | "Specialist" | null;
  specialty?: string;
  doctor: HomeVisitDoctor | null;
  date: string;
  timeSlot: string;
  address: string;
  landmark: string;
  patientName: string;
  patientAge: string;
  symptoms: string;
  totalAmount: number;
  bookingId?: string;
}

const DoctorHomeVisit = () => {
  const [step, setStep] = useState<BookingStep>("doctor-type");
  const [booking, setBooking] = useState<HomeVisitBookingDetails>({
    doctorType: null,
    doctor: null,
    date: "",
    timeSlot: "",
    address: "",
    landmark: "",
    patientName: "",
    patientAge: "",
    symptoms: "",
    totalAmount: 0,
  });

  const updateBooking = (updates: Partial<HomeVisitBookingDetails>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (newStep: BookingStep) => {
    setStep(newStep);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="pt-4"
        >
          {step === "doctor-type" && (
            <DoctorTypeSelection
              onSelect={(doctorType, specialty) => {
                updateBooking({ doctorType, specialty });
                goToStep("doctors");
              }}
            />
          )}

          {step === "doctors" && booking.doctorType && (
            <HomeVisitDoctorList
              doctorType={booking.doctorType}
              specialty={booking.specialty}
              onSelect={(doctor) => {
                updateBooking({ doctor, totalAmount: doctor.visitFee });
                goToStep("schedule");
              }}
              onBack={() => goToStep("doctor-type")}
            />
          )}

          {step === "schedule" && booking.doctor && (
            <HomeVisitScheduling
              doctor={booking.doctor}
              booking={booking}
              onUpdate={updateBooking}
              onConfirm={() => {
                const bookingId = `DHV${Date.now().toString().slice(-8)}`;
                updateBooking({ bookingId });
                goToStep("confirmation");
              }}
              onBack={() => goToStep("doctors")}
            />
          )}

          {step === "confirmation" && (
            <HomeVisitConfirmation booking={booking} />
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default DoctorHomeVisit;
