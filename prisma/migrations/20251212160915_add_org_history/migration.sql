/*
  Warnings:

  - You are about to drop the column `advisorId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `leaderId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_advisorId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_leaderId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "advisorId",
DROP COLUMN "leaderId";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "periodEnd" INTEGER,
ADD COLUMN     "periodStart" INTEGER NOT NULL DEFAULT 2025;

-- CreateTable
CREATE TABLE "OrgPeriod" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "periodStart" INTEGER NOT NULL,
    "periodEnd" INTEGER,
    "leaderId" TEXT,
    "advisorId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrgPeriod_periodStart_idx" ON "OrgPeriod"("periodStart");

-- AddForeignKey
ALTER TABLE "OrgPeriod" ADD CONSTRAINT "OrgPeriod_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgPeriod" ADD CONSTRAINT "OrgPeriod_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgPeriod" ADD CONSTRAINT "OrgPeriod_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
