-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT_PILOT', 'PILOT');

-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "AircraftStation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arm" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION,
    "aircraftId" TEXT NOT NULL,

    CONSTRAINT "AircraftStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT_PILOT',
    "licenseNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "id" TEXT NOT NULL,
    "tailNumber" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "emptyWeight" DOUBLE PRECISION NOT NULL,
    "emptyWeightArm" DOUBLE PRECISION NOT NULL,
    "maxTakeOffWeight" DOUBLE PRECISION NOT NULL,
    "fuelCapacity" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightSession" (
    "id" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "status" "FlightStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDeparture" TIMESTAMP(3) NOT NULL,
    "scheduledArrival" TIMESTAMP(3) NOT NULL,
    "aircraftId" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "instructorId" TEXT,
    "takeOffWeight" DOUBLE PRECISION,
    "centerOfGravity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_licenseNumber_key" ON "User"("licenseNumber");

-- CreateIndex
CREATE INDEX "User_email_role_idx" ON "User"("email", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft_tailNumber_key" ON "Aircraft"("tailNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FlightSession_flightNumber_key" ON "FlightSession"("flightNumber");

-- CreateIndex
CREATE INDEX "FlightSession_scheduledDeparture_status_idx" ON "FlightSession"("scheduledDeparture", "status");

-- AddForeignKey
ALTER TABLE "AircraftStation" ADD CONSTRAINT "AircraftStation_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightSession" ADD CONSTRAINT "FlightSession_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightSession" ADD CONSTRAINT "FlightSession_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightSession" ADD CONSTRAINT "FlightSession_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
