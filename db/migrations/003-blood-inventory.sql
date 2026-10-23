CREATE TABLE blood_inventory (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camp_id      TEXT NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
    blood_type   TEXT NOT NULL CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    units        INTEGER NOT NULL DEFAULT 0 CHECK (units >= 0),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (camp_id, blood_type)
);

CREATE INDEX idx_blood_inventory_camp ON blood_inventory(camp_id);
CREATE INDEX idx_blood_inventory_type ON blood_inventory(blood_type);
