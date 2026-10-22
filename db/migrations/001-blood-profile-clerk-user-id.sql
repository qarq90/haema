ALTER TABLE blood_profiles
    ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
