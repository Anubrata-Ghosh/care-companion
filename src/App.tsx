import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderLinkProvider } from "@/contexts/ProviderLinkContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { HealthChatbot } from "@/components/chat/HealthChatbot";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import DoctorAppointment from "./pages/DoctorAppointment";
import MedicineDelivery from "./pages/MedicineDelivery";
import LabTests from "./pages/LabTests";
import PartTimeNurse from "./pages/PartTimeNurse";
import EmergencySOS from "./pages/EmergencySOS";
import DoctorHomeVisit from "./pages/DoctorHomeVisit";
import ElderlyCare from "./pages/ElderlyCare";
import BookingHistory from "./pages/BookingHistory";
import History from "./pages/History";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import NursingHomeDetails from "./pages/NursingHomeDetails";
import DoctorDetails from "./pages/DoctorDetails";
import NursingHomeProvider from "./pages/NursingHomeProvider";
import PatientAds from "./pages/PatientAds";
import ProviderAds from "./pages/ProviderAds";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProviderLinkProvider>
        <Toaster />
          <Sonner />
          <BrowserRouter>
          <HealthChatbot />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/doctor-appointment" element={<DoctorAppointment />} />
            <Route path="/medicine-delivery" element={<MedicineDelivery />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/part-time-nurse" element={<PartTimeNurse />} />
            <Route path="/emergency-sos" element={<EmergencySOS />} />
            <Route path="/doctor-home-visit" element={<DoctorHomeVisit />} />
            <Route path="/elderly-care" element={<ElderlyCare />} />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/service-provider-dashboard" element={
              <ProtectedRoute>
                <ServiceProviderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/nursing-home/:id" element={<NursingHomeDetails />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/nursing-home-provider" element={
              <ProtectedRoute>
                <NursingHomeProvider />
              </ProtectedRoute>
            } />
            <Route path="/patient-ads" element={
              <ProtectedRoute>
                <PatientAds />
              </ProtectedRoute>
            } />
            <Route path="/provider-ads" element={
              <ProtectedRoute>
                <ProviderAds />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </ProviderLinkProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
