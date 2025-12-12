-- CreateEnum
CREATE TYPE "OrgCategory" AS ENUM ('KEILMUAN', 'KESENIAN');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "advisorId" TEXT,
ADD COLUMN     "category" "OrgCategory" NOT NULL DEFAULT 'KEILMUAN',
ADD COLUMN     "leaderId" TEXT;

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
