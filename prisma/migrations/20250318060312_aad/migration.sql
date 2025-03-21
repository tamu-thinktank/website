/*
  Warnings:

  - You are about to drop the column `assignedTeam` on the `InterviewNote` table. All the data in the column will be lost.
  - You are about to drop the column `interviewerId` on the `InterviewNote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewNote" DROP CONSTRAINT "InterviewNote_interviewerId_fkey";

-- DropIndex
DROP INDEX "InterviewNote_interviewerId_idx";

-- AlterTable
ALTER TABLE "InterviewNote" DROP COLUMN "assignedTeam",
DROP COLUMN "interviewerId";
