import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type BookingType = 
  | "doctor" 
  | "medicine" 
  | "lab" 
  | "nurse" 
  | "home-visit" 
  | "elderly-care" 
  | "emergency";

export interface CreateBookingParams {
  bookingType: BookingType;
  title: string;
  providerName: string;
  bookingDate: string; // YYYY-MM-DD format
  bookingTime: string;
  amount: number;
  location?: string;
  notes?: string;
}

export const useCreateBooking = () => {
  const { user } = useAuth();

  const createBooking = async (params: CreateBookingParams): Promise<string | null> => {
    if (!user) {
      // User not logged in - silently skip saving to database
      console.log("User not authenticated - booking not saved to database");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          booking_type: params.bookingType,
          title: params.title,
          provider_name: params.providerName,
          booking_date: params.bookingDate,
          booking_time: params.bookingTime,
          amount: params.amount,
          location: params.location || null,
          notes: params.notes || null,
          status: "upcoming",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        toast.error("Failed to save booking to your history");
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to save booking to your history");
      return null;
    }
  };

  return { createBooking, isAuthenticated: !!user };
};
