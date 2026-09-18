-- Persist the order chosen by each workspace owner/member in the UI.
ALTER TABLE "workspaces" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "documents" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "workspaces_sort_order_idx" ON "workspaces"("sort_order");
CREATE INDEX "documents_workspace_id_sort_order_idx" ON "documents"("workspace_id", "sort_order");
