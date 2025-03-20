/*
  Warnings:

  - The `preferredPronoun` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "preferredPronoun",
ADD COLUMN     "preferredPronoun" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT;

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Pronoun";
