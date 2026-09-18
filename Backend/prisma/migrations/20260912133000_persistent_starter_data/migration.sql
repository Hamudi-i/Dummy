-- Existing accounts receive the starter collection once, on their next login.
-- The flag prevents deleted starter items from being recreated later.
ALTER TABLE "users" ADD COLUMN "starter_data_initialized" BOOLEAN NOT NULL DEFAULT false;
