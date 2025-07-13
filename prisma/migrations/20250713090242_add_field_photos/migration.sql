/*
  Warnings:

  - You are about to drop the column `main_photo_url` on the `fields` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fields" DROP COLUMN "main_photo_url";

-- CreateTable
CREATE TABLE "field_photos" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "field_photos" ADD CONSTRAINT "field_photos_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
