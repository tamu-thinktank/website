/*
  Warnings:

  - Changed the type of `major` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "meetings" DROP NOT NULL,
ALTER COLUMN "weeklyCommitment" DROP NOT NULL,
DROP COLUMN "major",
ADD COLUMN     "major" TEXT NOT NULL,
ALTER COLUMN "signatureAccountability" DROP NOT NULL,
ALTER COLUMN "signatureCommitment" DROP NOT NULL,
ALTER COLUMN "signatureQuality" DROP NOT NULL,
ALTER COLUMN "firstQuestion" DROP NOT NULL,
ALTER COLUMN "secondQuestion" DROP NOT NULL,
ALTER COLUMN "applicationType" DROP NOT NULL,
ALTER COLUMN "summerPlans" DROP NOT NULL;
