-- Create service_providers table
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('doctor', 'nurse_caretaker', 'nursing_home', 'ambulance', 'delivery')),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  pincode TEXT,
  
  -- Medical/Professional credentials
  registration_number TEXT,
  college_name TEXT,
  graduation_year INTEGER,
  pg_college TEXT,
  pg_year INTEGER,
  pg_specialization TEXT,
  skills TEXT,
  experience_years INTEGER,
  certifications TEXT,
  
  -- Ratings and reviews
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  
  -- Pricing
  base_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, service_type)
);

-- Create service_provider_documents table
CREATE TABLE service_provider_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('registration_certificate', 'graduation_degree', 'pg_degree', 'health_certificate', 'other')),
  file_url TEXT,
  file_name TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- Create service_provider_specializations table (for doctors)
CREATE TABLE service_provider_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create service_packages table
CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  duration_days INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update bookings table to link with service providers
ALTER TABLE bookings 
ADD COLUMN provider_id UUID REFERENCES service_providers(id) ON DELETE SET NULL,
ADD COLUMN service_type TEXT,
ADD COLUMN patient_phone TEXT,
ADD COLUMN patient_address TEXT,
ADD COLUMN notes TEXT;

-- Create ad_campaigns table for provider ads
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  description TEXT,
  ad_content TEXT,
  keywords TEXT,
  total_budget DECIMAL(10,2) NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  duration_days INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  target_audiences TEXT, -- JSON array of audience segments
  reach_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create patient_provider_favorites table
CREATE TABLE patient_provider_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(patient_user_id, provider_id)
);

-- Create provider_reviews table
CREATE TABLE provider_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  patient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(provider_id, booking_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_service_providers_service_type ON service_providers(service_type);
CREATE INDEX idx_service_providers_city ON service_providers(city);
CREATE INDEX idx_service_providers_status ON service_providers(status);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_service_packages_provider_id ON service_packages(provider_id);
CREATE INDEX idx_ad_campaigns_provider_id ON ad_campaigns(provider_id);
CREATE INDEX idx_patient_provider_favorites_patient_id ON patient_provider_favorites(patient_user_id);
CREATE INDEX idx_provider_reviews_provider_id ON provider_reviews(provider_id);
CREATE INDEX idx_provider_reviews_patient_id ON provider_reviews(patient_user_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_provider_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Service providers can only see their own data
CREATE POLICY "Service providers view own data" ON service_providers
  FOR SELECT USING (auth.uid() = user_id OR is_verified = true);

CREATE POLICY "Service providers update own data" ON service_providers
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Anyone can view verified service providers
CREATE POLICY "Anyone view verified providers" ON service_providers
  FOR SELECT USING (is_verified = true);

-- Policy: Service providers can manage their own documents
CREATE POLICY "Service providers manage own documents" ON service_provider_documents
  FOR ALL USING (provider_id IN (SELECT id FROM service_providers WHERE user_id = auth.uid()));

-- Policy: Service providers can manage their packages
CREATE POLICY "Service providers manage own packages" ON service_packages
  FOR ALL USING (provider_id IN (SELECT id FROM service_providers WHERE user_id = auth.uid()));

-- Policy: Service providers can manage their campaigns
CREATE POLICY "Service providers manage own campaigns" ON ad_campaigns
  FOR ALL USING (provider_id IN (SELECT id FROM service_providers WHERE user_id = auth.uid()));

-- Policy: Patients can manage their favorites
CREATE POLICY "Patients manage own favorites" ON patient_provider_favorites
  FOR ALL USING (auth.uid() = patient_user_id);

-- Policy: Patients can see all providers' reviews
CREATE POLICY "Anyone view provider reviews" ON provider_reviews
  FOR SELECT USING (true);

-- Policy: Patients can create reviews for their bookings
CREATE POLICY "Patients create own reviews" ON provider_reviews
  FOR INSERT WITH CHECK (auth.uid() = patient_user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON service_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_packages_updated_at
  BEFORE UPDATE ON service_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_campaigns_updated_at
  BEFORE UPDATE ON ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
