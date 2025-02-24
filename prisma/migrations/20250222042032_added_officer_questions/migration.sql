-- CreateEnum
CREATE TYPE "OfficerCommitment" AS ENUM ('YES', 'PARTIAL', 'NO');

-- CreateEnum
CREATE TYPE "OfficerPosition" AS ENUM ('VICE_PRESIDENT', 'PROJECT_MANAGER', 'MARKETING_SPECIALIST', 'GRAPHIC_DESIGNER', 'WEB_DEV_LEAD', 'TREASURER', 'RECURRING_TEAM_PROJECT_MANAGER', 'DC_PROGRAM_MANAGER');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "officerCommitment" "OfficerCommitment",
ADD COLUMN     "summerPlans" TEXT;

-- CreateTable
CREATE TABLE "PositionPreference" (
    "id" TEXT NOT NULL,
    "position" "OfficerPosition" NOT NULL,
    "interest" "InterestLevel" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "PositionPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PositionPreference" ADD CONSTRAINT "PositionPreference_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
