-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_studentId_fkey";

-- AlterTable
ALTER TABLE "Achievement" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
