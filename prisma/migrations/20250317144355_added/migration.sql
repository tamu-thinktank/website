-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('UNFAMILIAR', 'MARGINAL', 'COMFORTABLE', 'EXPERT');

-- CreateEnum
CREATE TYPE "LearningInterestLevel" AS ENUM ('NOT_INTERESTED', 'MILD', 'MODERATE', 'STRONG', 'MOST_INTERESTED');

-- AlterEnum
ALTER TYPE "ApplicationType" ADD VALUE 'MATEROV';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "previousParticipation" BOOLEAN,
ADD COLUMN     "thirdQuestion" TEXT;

-- CreateTable
CREATE TABLE "SubteamPreference" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interest" "InterestLevel" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "SubteamPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningInterest" (
    "id" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "interestLevel" "LearningInterestLevel" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "LearningInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubteamPreference_applicantId_idx" ON "SubteamPreference"("applicantId");

-- CreateIndex
CREATE INDEX "Skill_applicantId_idx" ON "Skill"("applicantId");

-- CreateIndex
CREATE INDEX "LearningInterest_applicantId_idx" ON "LearningInterest"("applicantId");

-- AddForeignKey
ALTER TABLE "SubteamPreference" ADD CONSTRAINT "SubteamPreference_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningInterest" ADD CONSTRAINT "LearningInterest_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
