/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `field_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `fields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schedule_overrides` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sport_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `venues` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_field_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "field_schedules" DROP CONSTRAINT "field_schedules_field_id_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_sport_type_id_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_venue_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_overrides" DROP CONSTRAINT "schedule_overrides_field_id_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "venues" DROP CONSTRAINT "venues_renter_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "field_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "bookings_id_seq";

-- AlterTable
ALTER TABLE "field_schedules" DROP CONSTRAINT "field_schedules_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "field_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "field_schedules_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "field_schedules_id_seq";

-- AlterTable
ALTER TABLE "fields" DROP CONSTRAINT "fields_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "venue_id" SET DATA TYPE TEXT,
ALTER COLUMN "sport_type_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "fields_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "fields_id_seq";

-- AlterTable
ALTER TABLE "schedule_overrides" DROP CONSTRAINT "schedule_overrides_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "field_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "schedule_overrides_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "schedule_overrides_id_seq";

-- AlterTable
ALTER TABLE "sport_types" DROP CONSTRAINT "sport_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sport_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sport_types_id_seq";

-- AlterTable
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "venues" DROP CONSTRAINT "venues_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "renter_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "venues_id_seq";

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_sport_type_id_fkey" FOREIGN KEY ("sport_type_id") REFERENCES "sport_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_schedules" ADD CONSTRAINT "field_schedules_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_overrides" ADD CONSTRAINT "schedule_overrides_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
