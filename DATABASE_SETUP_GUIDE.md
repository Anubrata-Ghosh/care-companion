# Service Provider Database Integration Guide

## Overview
This guide explains how to set up and link service providers with the patient database in CareNest.

## Database Schema

### Core Tables

#### 1. **service_providers**
Stores all service provider information
- User linkage (via user_id)
- Service type (doctor, nurse, ambulance, delivery, nursing_home)
- Professional credentials (registration number, college, experience)
- Verification status
- Rating and review count

#### 2. **service_provider_documents**
Stores uploaded credentials and certificates
- Medical registration certificates
- Degree certificates (graduation & PG)
- Health certificates
- Other relevant documents

#### 3. **service_provider_specializations**
For doctors to list their specializations
- Links doctors to multiple specializations
- Allows filtering by specialty

#### 4. **service_packages**
Service offerings with pricing
- Different service types with different prices
- Discount support
- Duration information

#### 5. **bookings** (Enhanced)
Patient-to-provider bookings
- Links patients (user_id) to providers (provider_id)
- Service type and appointment details
- Patient contact information

#### 6. **ad_campaigns**
Provider advertising campaigns
- Budget management
- Target audience selection
- Performance tracking (reach, clicks)

#### 7. **patient_provider_favorites**
Patient-side favorites list
- Allows patients to save their favorite providers
- Quick access to frequently used providers

#### 8. **provider_reviews**
Rating and review system
- Patient ratings of providers
- Review text
- Links to original booking

## Implementation Steps

### Step 1: Connect to Supabase
1. Click [Connect to Supabase](#open-mcp-popover)
2. Log in with your Supabase credentials
3. Select your CareNest project

### Step 2: Run Database Migrations
Execute the SQL migration file: `supabase/migrations/001_create_service_providers_schema.sql`

This creates:
- All new tables with proper relationships
- Indexes for performance
- Row-level security policies
- Triggers for timestamp updates

### Step 3: Update TypeScript Types
The generated TypeScript types in `src/integrations/supabase/types.ts` will automatically include the new tables after running migrations.

### Step 4: Use Service Functions
Import and use functions from `src/services/serviceProviderService.ts`:

```typescript
import { createServiceProvider, getProvidersByCity, createBooking } from "@/services/serviceProviderService";

// Create service provider
const { data: provider } = await createServiceProvider(userId, "doctor", fullName, email, phone);

// Get providers in a city
const providers = await getProvidersByCity("Mumbai", "doctor");

// Create booking
const { data: booking } = await createBooking(patientUserId, providerId, {
  title: "General Consultation",
  bookingType: "consultation",
  bookingDate: "2024-02-01",
  bookingTime: "10:00",
  amount: 500,
  location: "Clinic",
  notes: "Follow-up",
  serviceType: "doctor",
  patientPhone: "+91-9999999999",
  patientAddress: "Address, City"
});
```

## Key Features

### 1. Service Provider Registration
- Complete profile with credentials
- Document upload (certificates, registration)
- Specialization selection
- Service package setup
- Rate setting

### 2. Patient-Provider Matching
- Browse providers by service type
- Filter by city/location
- View ratings and reviews
- Add to favorites
- Book appointments

### 3. Appointments Management
- Link appointments to specific providers
- Track appointment history
- Show provider details in booking
- Patient contact info stored

### 4. Reviews & Ratings
- Patients rate providers after service
- View provider ratings
- Read reviews from other patients
- Calculate average rating

### 5. Advertisement System
- Providers create ad campaigns
- Set budget and duration
- Target specific audiences
- Track campaign performance

### 6. Security (Row Level Security)
- Providers only see their own data
- Patients see only verified providers
- Reviews visible to everyone
- Personal data protected

## Database Relationships

```
Patients (auth.users)
    ↓
    ├→ bookings → service_providers
    ├→ patient_provider_favorites → service_providers
    ├→ provider_reviews → service_providers
    └→ profiles (patient profile)

Service Providers (service_providers)
    ├→ service_provider_documents (credentials)
    ├→ service_provider_specializations (doctors only)
    ├→ service_packages (offerings)
    ├→ ad_campaigns (advertisements)
    ├→ bookings (appointments)
    └→ provider_reviews (feedback)
```

## Migration Checklist

- [ ] Connect to Supabase
- [ ] Run SQL migrations
- [ ] Verify tables created in Supabase dashboard
- [ ] Set up storage bucket for documents (`provider_documents`)
- [ ] Update environment variables if needed
- [ ] Test service functions with sample data
- [ ] Update existing components to use service_provider_id
- [ ] Create UI for provider registration
- [ ] Create UI for provider management
- [ ] Create UI for patient browsing/booking

## Testing Database Connection

```typescript
// Test in your component
import { getProvidersByServiceType } from "@/services/serviceProviderService";

useEffect(() => {
  const testConnection = async () => {
    const providers = await getProvidersByServiceType("doctor", 5);
    console.log("Doctors found:", providers);
  };
  testConnection();
}, []);
```

## Storage Setup

Create a new storage bucket in Supabase:
1. Go to Storage in Supabase dashboard
2. Create new bucket: `provider_documents`
3. Set privacy to public (or configure as needed)
4. This is used for storing certificate uploads

## Next Steps

1. **Update existing components** to reference service_providers
2. **Integrate with doctor/nurse provider pages** to show real data
3. **Add patient search/browse** functionality
4. **Implement booking flow** with provider selection
5. **Add review system** after appointments
6. **Setup notifications** for new bookings
7. **Create admin dashboard** for verification

## Common Queries

### Find all doctors in a city
```typescript
const doctors = await getProvidersByCity("Mumbai", "doctor");
```

### Get provider with full details
```typescript
const provider = await getServiceProviderByUserId(userId);
const packages = await getServicePackages(provider.id);
const reviews = await getProviderReviews(provider.id);
```

### Create booking with provider
```typescript
const booking = await createBooking(patientId, providerId, {
  title: "Appointment",
  bookingType: "consultation",
  bookingDate: "2024-02-01",
  bookingTime: "14:30",
  amount: 500,
  serviceType: "doctor"
});
```

## Troubleshooting

**Q: Tables not showing up after migration**
A: Ensure you're viewing the correct schema (public) in Supabase dashboard

**Q: Permission denied errors**
A: Check Row Level Security policies - ensure your user has proper access

**Q: Document upload fails**
A: Verify storage bucket exists and is named `provider_documents`

**Q: Queries returning empty results**
A: Check if providers are marked as `is_verified = true`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
