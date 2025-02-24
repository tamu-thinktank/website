/*
  Warnings:

  - Added the required column `applicationType` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('MEMBER', 'OFFICER');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "applicationType" "ApplicationType" NOT NULL;
