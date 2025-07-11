/*
  Warnings:

  - You are about to drop the column `main_photo_url` on the `venues` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "venues_name_key";

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "main_photo_url";

-- CreateTable
CREATE TABLE "venue_photos" (
    "id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venue_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "venue_photos" ADD CONSTRAINT "venue_photos_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
