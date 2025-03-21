/*
  Warnings:

  - Changed the type of `major` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Major" AS ENUM ('AERO', 'BIOE', 'BMEN', 'CHEM', 'CHEN', 'CIVE', 'COMM', 'CSCE', 'ECEN', 'ECON', 'ENGR', 'GEOE', 'GEOL', 'ISEN', 'MARA', 'MATH', 'MEEN', 'NUEN', 'OCEN', 'OPEN', 'PETE', 'PHYS', 'STAT');

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "major",
ADD COLUMN     "major" "Major" NOT NULL;
