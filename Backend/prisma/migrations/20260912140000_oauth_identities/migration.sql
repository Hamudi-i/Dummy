CREATE TABLE "oauth_identities" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "oauth_identities_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "oauth_identities_provider_provider_id_key" ON "oauth_identities"("provider", "provider_id");
CREATE INDEX "oauth_identities_user_id_idx" ON "oauth_identities"("user_id");
ALTER TABLE "oauth_identities" ADD CONSTRAINT "oauth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
