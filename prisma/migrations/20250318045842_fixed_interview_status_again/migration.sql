/*
  Warnings:

  - You are about to drop the column `userId` on the `InterviewNote` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `InterviewNote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InterviewNote" DROP CONSTRAINT "InterviewNote_userId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "assignedTeam" TEXT;

-- AlterTable
ALTER TABLE "InterviewNote" DROP COLUMN "userId",
ADD COLUMN     "assignedTeam" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "interviewerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "InterviewNote_applicantId_idx" ON "InterviewNote"("applicantId");

-- CreateIndex
CREATE INDEX "InterviewNote_interviewerId_idx" ON "InterviewNote"("interviewerId");

-- AddForeignKey
ALTER TABLE "InterviewNote" ADD CONSTRAINT "InterviewNote_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
