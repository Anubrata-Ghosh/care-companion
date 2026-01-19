import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import SpecialtySearch from "@/components/doctor/SpecialtySearch";
import NursingHomeList from "@/components/doctor/NursingHomeList";
import DoctorProfile from "@/components/doctor/DoctorProfile";
import TimeSlotPicker from "@/components/doctor/TimeSlotPicker";
import AppointmentConfirmation from "@/components/doctor/AppointmentConfirmation";

export type BookingStep = "specialty" | "nursing-homes" | "doctor" | "time-slot" | "confirmation";

export interface SelectedDoctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  image: string;
  nursingHome: string;
  languages: string[];
  availability: string;
}

export interface SelectedNursingHome {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image: string;
}

export interface BookingDetails {
  specialty: string;
  nursingHome: SelectedNursingHome | null;
  doctor: SelectedDoctor | null;
  date: Date | null;
  timeSlot: string;
  consultationType: "video" | "in-person";
}

const DoctorAppointment = () => {
  const [step, setStep] = useState<BookingStep>("specialty");
  const [booking, setBooking] = useState<BookingDetails>({
    specialty: "",
    nursingHome: null,
    doctor: null,
    date: null,
    timeSlot: "",
    consultationType: "in-person",
  });

  const updateBooking = (updates: Partial<BookingDetails>) => {
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 pt-4">
        <AnimatePresence mode="wait">
          {step === "specialty" && (
            <motion.div
              key="specialty"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <SpecialtySearch
                onSelect={(specialty) => {
                  updateBooking({ specialty });
                  goToStep("nursing-homes");
                }}
              />
            </motion.div>
          )}

          {step === "nursing-homes" && (
            <motion.div
              key="nursing-homes"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <NursingHomeList
                specialty={booking.specialty}
                onSelect={(nursingHome) => {
                  updateBooking({ nursingHome });
                  goToStep("doctor");
                }}
                onBack={() => goToStep("specialty")}
              />
            </motion.div>
          )}

          {step === "doctor" && booking.nursingHome && (
            <motion.div
              key="doctor"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <DoctorProfile
                nursingHome={booking.nursingHome}
                specialty={booking.specialty}
                onSelect={(doctor) => {
                  updateBooking({ doctor });
                  goToStep("time-slot");
                }}
                onBack={() => goToStep("nursing-homes")}
              />
            </motion.div>
          )}

          {step === "time-slot" && booking.doctor && (
            <motion.div
              key="time-slot"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TimeSlotPicker
                doctor={booking.doctor}
                booking={booking}
                onUpdate={updateBooking}
                onConfirm={() => goToStep("confirmation")}
                onBack={() => goToStep("doctor")}
              />
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <AppointmentConfirmation
                booking={booking}
                onBack={() => goToStep("time-slot")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default DoctorAppointment;
