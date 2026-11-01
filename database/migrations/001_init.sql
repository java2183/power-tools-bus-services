-- 001_init.sql
-- Power Tools Bus Services Management System
-- Relational database schema for Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role_id UUID REFERENCES public.roles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  bus_type TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  license_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  departure_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  ticket_price_zmw NUMERIC(10,2) NOT NULL CHECK (ticket_price_zmw >= 0),
  estimated_duration_minutes INTEGER NOT NULL CHECK (estimated_duration_minutes > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE RESTRICT,
  bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE RESTRICT,
  departure_at TIMESTAMPTZ NOT NULL,
  arrival_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  available_seats INTEGER NOT NULL DEFAULT 0,
  total_seats INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id UUID NOT NULL REFERENCES public.passengers(id) ON DELETE RESTRICT,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE RESTRICT,
  booking_ref TEXT NOT NULL UNIQUE,
  booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'pending')),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.booking_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, seat_number),
  UNIQUE (booking_id, seat_number)
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'mobile_money', 'bank')),
  payment_reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'partial', 'unpaid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  ticket_code TEXT NOT NULL UNIQUE,
  qr_code TEXT,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'verified', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Power Tools Bus Services',
  contact_email TEXT,
  whatsapp_number TEXT,
  address TEXT,
  currency TEXT NOT NULL DEFAULT 'ZMW',
  logo_url TEXT,
  ticket_branding TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trips_route_id ON public.trips(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON public.trips(bus_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON public.trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON public.bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_id ON public.bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_trip_id ON public.booking_seats(trip_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_booking_id ON public.tickets(booking_id);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles are viewable by authenticated users"
ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can be managed by authenticated administrators"
ON public.roles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Profiles can be viewed by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Buses are readable by authenticated users"
ON public.buses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Buses can be managed by authenticated users"
ON public.buses FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Drivers are readable by authenticated users"
ON public.drivers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Drivers can be managed by authenticated users"
ON public.drivers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Routes are readable by authenticated users"
ON public.routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Routes can be managed by authenticated users"
ON public.routes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Trips are readable by authenticated users"
ON public.trips FOR SELECT TO authenticated USING (true);
CREATE POLICY "Trips can be managed by authenticated users"
ON public.trips FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Passengers are readable by authenticated users"
ON public.passengers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Passengers can be managed by authenticated users"
ON public.passengers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Bookings are readable by authenticated users"
ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bookings can be managed by authenticated users"
ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Booking seats are readable by authenticated users"
ON public.booking_seats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Booking seats can be managed by authenticated users"
ON public.booking_seats FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Payments are readable by authenticated users"
ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Payments can be managed by authenticated users"
ON public.payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Tickets are readable by authenticated users"
ON public.tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tickets can be managed by authenticated users"
ON public.tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Settings are readable by authenticated users"
ON public.company_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Settings can be managed by authenticated users"
ON public.company_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, role_id, status)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone',
    (SELECT id FROM public.roles WHERE name = 'ticketing_officer' LIMIT 1),
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.reserve_seat(p_booking_id UUID, p_trip_id UUID, p_seat_number TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.booking_seats
    WHERE trip_id = p_trip_id
      AND seat_number = p_seat_number
      AND status = 'confirmed'
  ) THEN
    RAISE EXCEPTION 'Seat % is already assigned for this trip.', p_seat_number;
  END IF;

  INSERT INTO public.booking_seats (booking_id, trip_id, seat_number, status)
  VALUES (p_booking_id, p_trip_id, p_seat_number, 'confirmed');

  RETURN TRUE;
END;
$$;

INSERT INTO public.roles (name, description)
VALUES
  ('administrator', 'System administrator'),
  ('manager', 'Operations manager'),
  ('ticketing_officer', 'Ticketing and booking staff'),
  ('driver', 'Bus driver with trip access')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.company_settings (company_name, contact_email, whatsapp_number, address, currency, ticket_branding)
VALUES (
  'Power Tools Bus Services',
  'info@powertoolsbus.com',
  '+260977123456',
  'Lusaka, Zambia',
  'ZMW',
  'Power Tools Bus Services'
)
ON CONFLICT DO NOTHING;
