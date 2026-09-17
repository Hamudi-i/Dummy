-- Starter content is no longer created for user accounts.
ALTER TABLE "users" DROP COLUMN "starter_data_initialized";
