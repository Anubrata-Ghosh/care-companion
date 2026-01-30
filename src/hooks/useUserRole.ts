import { useAuth } from "@/contexts/AuthContext";

export const useUserRole = () => {
  const { userRole } = useAuth();
  
  const isPatient = userRole === "patient";
  const isServiceProvider = userRole === "service_provider";
  const isAuthenticated = userRole !== null;

  return {
    userRole,
    isPatient,
    isServiceProvider,
    isAuthenticated,
  };
};
