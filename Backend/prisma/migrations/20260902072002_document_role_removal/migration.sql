/*
  Warnings:

  - You are about to drop the column `is_public` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `public_role` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the `document_access` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "document_access" DROP CONSTRAINT "document_access_document_id_fkey";

-- DropForeignKey
ALTER TABLE "document_access" DROP CONSTRAINT "document_access_user_id_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "is_public",
DROP COLUMN "public_role";

-- DropTable
DROP TABLE "document_access";

-- DropEnum
DROP TYPE "DocumentRole";
