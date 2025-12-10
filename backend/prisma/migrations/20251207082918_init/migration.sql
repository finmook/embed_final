-- CreateEnum
CREATE TYPE "SensorEventType" AS ENUM ('ACCIDENT', 'TILT', 'DISTANCE');

-- CreateTable
CREATE TABLE "SensorEvent" (
    "id" TEXT NOT NULL,
    "type" "SensorEventType" NOT NULL,
    "value" DOUBLE PRECISION,
    "status" BOOLEAN,
    "threshold" DOUBLE PRECISION NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SensorEvent_type_triggeredAt_idx" ON "SensorEvent"("type", "triggeredAt");
