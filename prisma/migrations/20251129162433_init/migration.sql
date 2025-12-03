-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED', 'DEMO');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'OTHER');

-- CreateEnum
CREATE TYPE "DriveType" AS ENUM ('FWD', 'RWD', 'AWD', 'FOUR_WD');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealership" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "dealershipId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT,
    "year" INTEGER NOT NULL,
    "firstRegistration" INTEGER,
    "vin" TEXT,
    "stockNumber" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "mileageKm" INTEGER,
    "previousOwners" INTEGER,
    "condition" "Condition" NOT NULL DEFAULT 'USED',
    "warrantyType" TEXT,
    "warrantyExpiry" TIMESTAMP(3),
    "itvValidUntil" TIMESTAMP(3),
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "reservedByUserId" INTEGER,
    "reservedUntil" TIMESTAMP(3),
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroTaglineTitle" TEXT,
    "heroTaglineBody" TEXT,
    "heroVideoUrl" TEXT,
    "highlight_0_100_s" DOUBLE PRECISION,
    "highlight_power_kw" DOUBLE PRECISION,
    "highlight_power_hp" DOUBLE PRECISION,
    "highlight_top_speed" DOUBLE PRECISION,
    "powerTotalHp" DOUBLE PRECISION,
    "maxSpeedLimitedKmh" DOUBLE PRECISION,
    "maxSpeedUnlockedKmh" DOUBLE PRECISION,
    "massDinKg" DOUBLE PRECISION,
    "electricRangeWltpKm" DOUBLE PRECISION,
    "accel_0_100_s" DOUBLE PRECISION,
    "accel_0_200_s" DOUBLE PRECISION,
    "accel_0_300_s" DOUBLE PRECISION,
    "accel_0_400_s" DOUBLE PRECISION,
    "engineConfiguration" TEXT,
    "engineArchitecture" TEXT,
    "engineDisplacementL" DOUBLE PRECISION,
    "enginePowerHp" DOUBLE PRECISION,
    "engineTorqueNm" DOUBLE PRECISION,
    "engineMaxRpm" INTEGER,
    "lengthMm" INTEGER,
    "widthMm" INTEGER,
    "widthWithMirrorsMm" INTEGER,
    "heightMm" INTEGER,
    "wheelbaseMm" INTEGER,
    "transmissionType" TEXT,
    "elsdDescription" TEXT,
    "eSynchroDescription" TEXT,
    "transmissionCooling" TEXT,
    "frontMotorLayout" TEXT,
    "frontMotorPowerKwTotal" DOUBLE PRECISION,
    "frontMotorTorqueNmWheels" DOUBLE PRECISION,
    "frontMotorMaxRpm" INTEGER,
    "frontMotorType" TEXT,
    "frontInverterType" TEXT,
    "frontDriveSystem" TEXT,
    "batteryArchitectureV" INTEGER,
    "batteryPowerPeakKw" DOUBLE PRECISION,
    "batteryEnergyKwh" DOUBLE PRECISION,
    "batteryCooling" TEXT,
    "rearMotorPowerKw" DOUBLE PRECISION,
    "rearMotorTorqueNm" DOUBLE PRECISION,
    "rearMotorMaxRpm" INTEGER,
    "rearMotorType" TEXT,
    "rearInverterType" TEXT,
    "bodyType" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "driveType" "DriveType",
    "fuelType" "FuelType",
    "exteriorColor" TEXT,
    "interiorColor" TEXT,
    "upholstery" TEXT,
    "optionsSummary" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isHero" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dealership_slug_key" ON "Dealership"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "Vehicle"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_stockNumber_key" ON "Vehicle"("stockNumber");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_reservedByUserId_fkey" FOREIGN KEY ("reservedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
