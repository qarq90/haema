CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    camp_id TEXT,
    patient_name TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    units_needed INTEGER NOT NULL DEFAULT 1 CHECK (units_needed > 0),
    urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'pending',
    hospital TEXT NOT NULL,
    city TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    reason TEXT,
    needed_by TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE request_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    donor_user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pledged',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (request_id, donor_user_id)
);

CREATE INDEX idx_requests_public ON requests (status, urgency, needed_by, created_at);
CREATE INDEX idx_requests_user ON requests (user_id, created_at DESC);
CREATE INDEX idx_request_responses_request ON request_responses (request_id, status);
CREATE INDEX idx_request_responses_donor ON request_responses (donor_user_id, created_at DESC);
