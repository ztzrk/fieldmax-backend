/*
  Warnings:

  - You are about to drop the column `icon_url` on the `sport_types` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sport_types" DROP COLUMN "icon_url",
ADD COLUMN     "icon_name" TEXT;
