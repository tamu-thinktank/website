/*
  Warnings:

  - Added the required column `signatureAccountability` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signatureCommitment` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signatureQuality` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "signatureAccountability" TEXT NOT NULL,
ADD COLUMN     "signatureCommitment" TEXT NOT NULL,
ADD COLUMN     "signatureQuality" TEXT NOT NULL;
