-- Profile and notification settings entered in the frontend.
ALTER TABLE "users"
  ADD COLUMN "username" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "email_notifications" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "mention_notifications" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- Workspace presentation fields and archive state.
ALTER TABLE "workspaces"
  ADD COLUMN "description" TEXT,
  ADD COLUMN "icon" TEXT,
  ADD COLUMN "color" TEXT,
  ADD COLUMN "badge_label" TEXT,
  ADD COLUMN "badge_style" TEXT,
  ADD COLUMN "preview_gradient" TEXT,
  ADD COLUMN "rotation" TEXT,
  ADD COLUMN "is_archived" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "archived_at" TIMESTAMP(3);

CREATE INDEX "workspaces_is_archived_idx" ON "workspaces"("is_archived");

-- Notebook presentation metadata.
ALTER TABLE "documents"
  ADD COLUMN "description" TEXT,
  ADD COLUMN "page_count" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';

-- One working draft per document; saving the document does not remove its canonical content.
CREATE TABLE "document_drafts" (
  "id" TEXT NOT NULL,
  "document_id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "is_unsaved" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "document_drafts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_drafts_document_id_key" ON "document_drafts"("document_id");
ALTER TABLE "document_drafts" ADD CONSTRAINT "document_drafts_document_id_fkey"
  FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Messages submitted through the Help screen.
CREATE TABLE "support_requests" (
  "id" TEXT NOT NULL,
  "user_id" TEXT,
  "email" TEXT,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "support_requests_user_id_created_at_idx" ON "support_requests"("user_id", "created_at");
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Audit trail for UI-only interactions such as search, export, and OAuth-provider selection.
CREATE TABLE "user_events" (
  "id" TEXT NOT NULL,
  "user_id" TEXT,
  "event_type" TEXT NOT NULL,
  "payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_events_user_id_created_at_idx" ON "user_events"("user_id", "created_at");
CREATE INDEX "user_events_event_type_created_at_idx" ON "user_events"("event_type", "created_at");
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
