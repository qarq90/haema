ALTER TABLE camp_bookings
    ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
