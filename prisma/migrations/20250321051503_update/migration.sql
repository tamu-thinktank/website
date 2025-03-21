/*
  Warnings:

  - The values [RECURRING_TEAM_PROJECT_MANAGER] on the enum `OfficerPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OfficerPosition_new" AS ENUM ('VICE_PRESIDENT', 'PROJECT_MANAGER', 'MARKETING_SPECIALIST', 'GRAPHIC_DESIGNER', 'WEB_DEV_LEAD', 'TREASURER', 'DC_PROGRAM_MANAGER');
ALTER TABLE "PositionPreference" ALTER COLUMN "position" TYPE "OfficerPosition_new" USING ("position"::text::"OfficerPosition_new");
ALTER TYPE "OfficerPosition" RENAME TO "OfficerPosition_old";
ALTER TYPE "OfficerPosition_new" RENAME TO "OfficerPosition";
DROP TYPE "OfficerPosition_old";
COMMIT;

-- AlterEnum
ALTER TYPE "ReferralSource" ADD VALUE 'OTHER';
