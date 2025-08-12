/*
  Warnings:

  - You are about to drop the column `fieldId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `venue_id` on the `conversations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,field_id]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `field_id` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_venue_id_fkey";

-- DropIndex
DROP INDEX "conversations_user_id_renter_id_venue_id_key";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "fieldId",
DROP COLUMN "venue_id",
ADD COLUMN     "field_id" TEXT NOT NULL,
ADD COLUMN     "venueId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_user_id_field_id_key" ON "conversations"("user_id", "field_id");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
