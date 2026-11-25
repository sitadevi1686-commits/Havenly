-- ====================================================================
-- HAVENLY: Premium Student Accommodation Platform
-- Full Database Schema, Triggers, RLS Policies & Concurrency Functions
-- Migration: 20261125_havenly_schema.sql
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. CREATE TABLES
-- ====================================================================

-- 2.1 User Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'owner', 'admin')) DEFAULT 'student',
    college TEXT,
    owner_type TEXT CHECK (owner_type IN ('individual', 'commercial', 'agency')),
    avatar_url TEXT,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Premium PG', 'Student Apartments', 'Shared Accommodation', 'Independent Flats')),
    tagline TEXT,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    college_name TEXT NOT NULL,
    distance_km NUMERIC(4,2) NOT NULL,
    monthly_rent NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2) NOT NULL,
    room_sharing_types TEXT[] NOT NULL,
    curfew_policy TEXT NOT NULL CHECK (curfew_policy IN ('Flexible', '11 PM', '10 PM')),
    curfew_details TEXT,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Property Photographs
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Rooms & Availability Inventory
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    room_type TEXT NOT NULL CHECK (room_type IN ('Single Studio', 'Double Sharing', 'Triple Sharing')),
    room_number_or_label TEXT,
    total_beds INTEGER NOT NULL,
    available_beds INTEGER NOT NULL,
    rent_per_bed NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_bed_limits CHECK (available_beds >= 0 AND available_beds <= total_beds)
);

-- 2.5 Bookings (State Machine: pending -> confirmed | rejected | cancelled -> completed)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE NOT NULL,
    property_id UUID NOT NULL REFERENCES public.properties(id),
    room_id UUID REFERENCES public.rooms(id),
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    check_in_date DATE NOT NULL,
    room_sharing_type TEXT NOT NULL,
    monthly_rent NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2) NOT NULL,
    utility_charges NUMERIC(10,2) DEFAULT 0,
    total_initial_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')) DEFAULT 'pending',
    owner_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Saved / Favourites
CREATE TABLE IF NOT EXISTS public.favourites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_property UNIQUE (student_id, property_id)
);

-- 2.7 Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    booking_id UUID UNIQUE REFERENCES public.bookings(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Reports for Suspicious / Inaccurate Listings
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    category TEXT NOT NULL CHECK (category IN ('Incorrect rental information', 'Misleading photographs', 'Suspicious property', 'Incorrect location', 'Other concerns')),
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 2.9 In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_confirmed', 'booking_rejected', 'booking_cancelled', 'property_approved', 'property_rejected', 'report_update', 'general')),
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 Private Property Verification Documents (Storage audited)
CREATE TABLE IF NOT EXISTS public.property_verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    document_name TEXT,
    document_url TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('ownership_deed', 'tax_receipt', 'fire_safety_cert', 'id_proof')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.11 Administrative Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(verification_status, is_active);
CREATE INDEX IF NOT EXISTS idx_properties_distance ON public.properties(distance_km);
CREATE INDEX IF NOT EXISTS idx_properties_rent ON public.properties(monthly_rent);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON public.bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- ====================================================================
-- 4. ATOMIC DATABASE CONCURRENCY PROCEDURES
-- ====================================================================

-- Function: Confirm booking and atomically decrement available bed count
CREATE OR REPLACE FUNCTION public.confirm_booking_and_update_rooms(p_booking_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room_id UUID;
    v_status TEXT;
    v_available INTEGER;
    v_booking_ref TEXT;
BEGIN
    -- 1. Fetch booking with row lock
    SELECT room_id, status, booking_reference INTO v_room_id, v_status, v_booking_ref
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
    END IF;

    IF v_status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking is already ' || v_status);
    END IF;

    -- 2. If room assigned, lock and check availability
    IF v_room_id IS NOT NULL THEN
        SELECT available_beds INTO v_available
        FROM public.rooms
        WHERE id = v_room_id
        FOR UPDATE;

        IF v_available <= 0 THEN
            RETURN jsonb_build_object('success', false, 'error', 'No beds available in selected room');
        END IF;

        -- Decrement room beds safely
        UPDATE public.rooms
        SET available_beds = available_beds - 1,
            updated_at = NOW()
        WHERE id = v_room_id;
    END IF;

    -- 3. Confirm booking
    UPDATE public.bookings
    SET status = 'confirmed',
        updated_at = NOW()
    WHERE id = p_booking_id;

    RETURN jsonb_build_object('success', true, 'reference', v_booking_ref);
END;
$$;

-- Function: Cancel booking and restore room availability
CREATE OR REPLACE FUNCTION public.cancel_booking_and_restore_rooms(p_booking_id UUID, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room_id UUID;
    v_status TEXT;
BEGIN
    SELECT room_id, status INTO v_room_id, v_status
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Booking not found');
    END IF;

    -- Restore bed if it was previously confirmed
    IF v_status = 'confirmed' AND v_room_id IS NOT NULL THEN
        UPDATE public.rooms
        SET available_beds = LEAST(total_beds, available_beds + 1),
            updated_at = NOW()
        WHERE id = v_room_id;
    END IF;

    UPDATE public.bookings
    SET status = 'cancelled',
        cancellation_reason = p_reason,
        updated_at = NOW()
    WHERE id = p_booking_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- ====================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles Policies
CREATE POLICY "Public profiles viewable by authenticated users" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can edit own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 5.2 Properties Policies
CREATE POLICY "Approved active properties are public" ON public.properties
    FOR SELECT USING (verification_status = 'approved' AND is_active = TRUE);

CREATE POLICY "Owners can view own properties" ON public.properties
    FOR SELECT TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert own properties" ON public.properties
    FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own properties" ON public.properties
    FOR UPDATE TO authenticated USING (owner_id = auth.uid());

-- 5.3 Bookings Policies
CREATE POLICY "Students can view own bookings" ON public.bookings
    FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Owners can view bookings for their properties" ON public.bookings
    FOR SELECT TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Students can create booking requests" ON public.bookings
    FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

CREATE POLICY "Owners can update booking status" ON public.bookings
    FOR UPDATE TO authenticated USING (owner_id = auth.uid());

-- 5.4 Favourites Policies
CREATE POLICY "Students can manage own favourites" ON public.favourites
    FOR ALL TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

-- 5.5 Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
