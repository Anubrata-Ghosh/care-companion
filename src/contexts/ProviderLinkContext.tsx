import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface LinkedProvider {
  id: string;
  name: string;
  serviceType: "nursing_home" | "doctor" | "nurse_caretaker" | "ambulance" | "delivery";
  email: string;
  rating?: number;
  specialization?: string;
  phone?: string;
  linkedDate: string;
}

interface ProviderLinkContextType {
  linkedProviders: LinkedProvider[];
  linkProvider: (provider: LinkedProvider) => void;
  unlinkProvider: (providerId: string) => void;
  isProviderLinked: (providerId: string) => boolean;
  getProvidersByType: (serviceType: LinkedProvider["serviceType"]) => LinkedProvider[];
}

const ProviderLinkContext = createContext<ProviderLinkContextType | undefined>(undefined);

export const ProviderLinkProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [linkedProviders, setLinkedProviders] = useState<LinkedProvider[]>([]);

  // Load linked providers from localStorage (mock database)
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`patient_providers_${user.id}`);
      if (stored) {
        try {
          setLinkedProviders(JSON.parse(stored));
        } catch {
          setLinkedProviders([]);
        }
      }
    }
  }, [user?.id]);

  // Save linked providers to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`patient_providers_${user.id}`, JSON.stringify(linkedProviders));
    }
  }, [linkedProviders, user?.id]);

  const linkProvider = (provider: LinkedProvider) => {
    setLinkedProviders((prev) => {
      // Avoid duplicates
      if (prev.find((p) => p.id === provider.id)) {
        return prev;
      }
      return [...prev, provider];
    });
  };

  const unlinkProvider = (providerId: string) => {
    setLinkedProviders((prev) => prev.filter((p) => p.id !== providerId));
  };

  const isProviderLinked = (providerId: string) => {
    return linkedProviders.some((p) => p.id === providerId);
  };

  const getProvidersByType = (serviceType: LinkedProvider["serviceType"]) => {
    return linkedProviders.filter((p) => p.serviceType === serviceType);
  };

  return (
    <ProviderLinkContext.Provider
      value={{ linkedProviders, linkProvider, unlinkProvider, isProviderLinked, getProvidersByType }}
    >
      {children}
    </ProviderLinkContext.Provider>
  );
};

export const useProviderLink = () => {
  const context = useContext(ProviderLinkContext);
  if (context === undefined) {
    throw new Error("useProviderLink must be used within a ProviderLinkProvider");
  }
  return context;
};
