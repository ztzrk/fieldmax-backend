-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "fields" ADD COLUMN     "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING';
