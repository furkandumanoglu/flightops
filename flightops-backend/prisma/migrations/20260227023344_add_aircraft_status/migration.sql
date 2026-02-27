-- CreateEnum
CREATE TYPE "AircraftStatus" AS ENUM ('READY', 'MAINTENANCE', 'GROUNDED');

-- AlterTable
ALTER TABLE "Aircraft" ADD COLUMN     "nextMaintenanceHours" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "status" "AircraftStatus" NOT NULL DEFAULT 'READY';
