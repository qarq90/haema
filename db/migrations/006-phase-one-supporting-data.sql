CREATE TABLE IF NOT EXISTS donation_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    center TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donation_appointments_user ON donation_appointments (user_id, appointment_date DESC);

CREATE TABLE IF NOT EXISTS blood_inventory_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID,
    camp_id TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    previous_units INTEGER NOT NULL,
    new_units INTEGER NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blood_inventory_history_lookup ON blood_inventory_history (camp_id, blood_type, created_at DESC);

CREATE TABLE IF NOT EXISTS inventory_restock_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    city TEXT NOT NULL,
    units_needed INTEGER NOT NULL CHECK (units_needed > 0),
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'fulfilled', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_restock_user ON inventory_restock_requests (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS saved_articles (
    user_id TEXT NOT NULL,
    article_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, article_id)
);
