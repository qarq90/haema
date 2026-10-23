CREATE TABLE hospital_blood_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         TEXT NOT NULL REFERENCES "users" ("user-id") ON DELETE CASCADE,
    hospital_name   TEXT NOT NULL,
    blood_type      TEXT NOT NULL CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    city            TEXT NOT NULL,
    units           INTEGER NOT NULL CHECK (units > 0),
    reason          TEXT NOT NULL,
    needed_by       DATE NOT NULL,
    status          TEXT NOT NULL DEFAULT 'Pending'
                    CHECK (status IN ('Pending', 'Approved', 'Fulfilled', 'Rejected')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hospital_blood_requests_open
    ON hospital_blood_requests (status, needed_by, created_at);
CREATE INDEX idx_hospital_blood_requests_blood_type
    ON hospital_blood_requests (blood_type);
CREATE INDEX idx_hospital_blood_requests_city
    ON hospital_blood_requests (city);
