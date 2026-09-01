/*
  Warnings:

  - You are about to drop the column `parent_id` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_parent_id_fkey";

-- DropIndex
DROP INDEX "documents_parent_id_idx";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "parent_id";
