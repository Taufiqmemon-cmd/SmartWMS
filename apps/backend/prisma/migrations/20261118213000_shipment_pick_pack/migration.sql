-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ShipmentStatus" ADD VALUE 'PICKING';
ALTER TYPE "ShipmentStatus" ADD VALUE 'PACKED';

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "fulfillmentRequired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ShipmentEvent" ADD COLUMN     "operationKey" TEXT;

-- AlterTable
ALTER TABLE "ShipmentItem" ADD COLUMN     "packedQuantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
ADD COLUMN     "pickedQuantity" DECIMAL(12,3) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentEvent_operationKey_key" ON "ShipmentEvent"("operationKey");
