/*
  Warnings:

  - You are about to drop the column `field_name` on the `fields` table. All the data in the column will be lost.
  - Added the required column `name` to the `fields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fields" DROP COLUMN "field_name",
ADD COLUMN     "name" TEXT NOT NULL;
