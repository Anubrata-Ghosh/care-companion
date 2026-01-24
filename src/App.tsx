import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DoctorAppointment from "./pages/DoctorAppointment";
import MedicineDelivery from "./pages/MedicineDelivery";
import LabTests from "./pages/LabTests";
import PartTimeNurse from "./pages/PartTimeNurse";
import EmergencySOS from "./pages/EmergencySOS";
import DoctorHomeVisit from "./pages/DoctorHomeVisit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/doctor-appointment" element={<DoctorAppointment />} />
          <Route path="/medicine-delivery" element={<MedicineDelivery />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/part-time-nurse" element={<PartTimeNurse />} />
          <Route path="/emergency-sos" element={<EmergencySOS />} />
          <Route path="/doctor-home-visit" element={<DoctorHomeVisit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
