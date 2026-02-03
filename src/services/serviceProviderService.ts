import { supabase } from "@/integrations/supabase/client";

// Get service provider by user ID
export const getServiceProviderByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching service provider:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// Create new service provider profile
export const createServiceProvider = async (
  userId: string,
  serviceType: "doctor" | "nurse_caretaker" | "nursing_home" | "ambulance" | "delivery",
  fullName: string,
  email: string,
  phone?: string
) => {
  try {
    const { data, error } = await supabase
      .from("service_providers")
      .insert([
        {
          user_id: userId,
          service_type: serviceType,
          full_name: fullName,
          email: email,
          phone: phone,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating service provider:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Update service provider profile
export const updateServiceProvider = async (
  providerId: string,
  updates: Record<string, any>
) => {
  try {
    const { data, error } = await supabase
      .from("service_providers")
      .update(updates)
      .eq("id", providerId)
      .select()
      .single();

    if (error) {
      console.error("Error updating service provider:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Get all service providers by service type
export const getProvidersByServiceType = async (serviceType: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .eq("service_type", serviceType)
      .eq("is_verified", true)
      .limit(limit);

    if (error) {
      console.error("Error fetching providers:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Get service providers by city
export const getProvidersByCity = async (city: string, serviceType?: string) => {
  try {
    let query = supabase
      .from("service_providers")
      .select("*")
      .eq("city", city)
      .eq("is_verified", true);

    if (serviceType) {
      query = query.eq("service_type", serviceType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching providers by city:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Upload service provider document
export const uploadProviderDocument = async (
  providerId: string,
  documentType: string,
  file: File
) => {
  try {
    // Upload file to Supabase storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${providerId}/${documentType}_${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("provider_documents")
      .upload(fileName, file, { upsert: false });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { error: uploadError };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("provider_documents")
      .getPublicUrl(fileName);

    // Save document record to database
    const { data, error } = await supabase
      .from("service_provider_documents")
      .insert([
        {
          provider_id: providerId,
          document_type: documentType,
          file_url: urlData?.publicUrl,
          file_name: file.name,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving document record:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Add service package
export const addServicePackage = async (
  providerId: string,
  serviceName: string,
  basePrice: number,
  description?: string,
  durationDays?: number
) => {
  try {
    const { data, error } = await supabase
      .from("service_packages")
      .insert([
        {
          provider_id: providerId,
          service_name: serviceName,
          description: description,
          base_price: basePrice,
          duration_days: durationDays,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding service package:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Get service packages for provider
export const getServicePackages = async (providerId: string) => {
  try {
    const { data, error } = await supabase
      .from("service_packages")
      .select("*")
      .eq("provider_id", providerId)
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching service packages:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Create ad campaign
export const createAdCampaign = async (
  providerId: string,
  campaignName: string,
  adContent: string,
  totalBudget: number,
  durationDays: number,
  targetAudiences: string[],
  keywords?: string
) => {
  try {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("ad_campaigns")
      .insert([
        {
          provider_id: providerId,
          campaign_name: campaignName,
          ad_content: adContent,
          total_budget: totalBudget,
          duration_days: durationDays,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          target_audiences: JSON.stringify(targetAudiences),
          keywords: keywords,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating ad campaign:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Get provider appointments/bookings
export const getProviderBookings = async (providerId: string) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("provider_id", providerId)
      .order("booking_date", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Create booking with service provider
export const createBooking = async (
  userId: string,
  providerId: string,
  bookingDetails: {
    title: string;
    bookingType: string;
    bookingDate: string;
    bookingTime: string;
    amount: number;
    location?: string;
    notes?: string;
    serviceType?: string;
    patientPhone?: string;
    patientAddress?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          provider_id: providerId,
          title: bookingDetails.title,
          booking_type: bookingDetails.bookingType,
          booking_date: bookingDetails.bookingDate,
          booking_time: bookingDetails.bookingTime,
          amount: bookingDetails.amount,
          location: bookingDetails.location,
          notes: bookingDetails.notes,
          service_type: bookingDetails.serviceType,
          patient_phone: bookingDetails.patientPhone,
          patient_address: bookingDetails.patientAddress,
          provider_name: "", // Will be populated from service provider
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Add provider to patient favorites
export const addToFavorites = async (patientUserId: string, providerId: string) => {
  try {
    const { data, error } = await supabase
      .from("patient_provider_favorites")
      .insert([
        {
          patient_user_id: patientUserId,
          provider_id: providerId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding to favorites:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Get patient favorites
export const getPatientFavorites = async (patientUserId: string) => {
  try {
    const { data, error } = await supabase
      .from("patient_provider_favorites")
      .select("provider_id, service_providers(*)")
      .eq("patient_user_id", patientUserId);

    if (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// Add provider review
export const addProviderReview = async (
  providerId: string,
  patientUserId: string,
  rating: number,
  reviewText: string,
  bookingId?: string
) => {
  try {
    const { data, error } = await supabase
      .from("provider_reviews")
      .insert([
        {
          provider_id: providerId,
          patient_user_id: patientUserId,
          booking_id: bookingId,
          rating: rating,
          review_text: reviewText,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding review:", error);
      return { error };
    }
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Get provider reviews
export const getProviderReviews = async (providerId: string) => {
  try {
    const { data, error } = await supabase
      .from("provider_reviews")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
