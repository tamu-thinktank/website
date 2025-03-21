/*
  Warnings:

  - You are about to drop the column `createdAt` on the `InterviewNote` table. All the data in the column will be lost.
  - You are about to drop the column `interviewerId` on the `InterviewNote` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `InterviewNote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewNote" DROP CONSTRAINT "InterviewNote_interviewerId_fkey";

-- DropIndex
DROP INDEX "InterviewNote_applicantId_idx";

-- DropIndex
DROP INDEX "InterviewNote_interviewerId_idx";

-- AlterTable
ALTER TABLE "InterviewNote" DROP COLUMN "createdAt",
DROP COLUMN "interviewerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "InterviewNote" ADD CONSTRAINT "InterviewNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
