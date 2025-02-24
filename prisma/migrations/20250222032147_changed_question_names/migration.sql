/*
  Warnings:

  - You are about to drop the column `passion` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `teamwork` on the `Application` table. All the data in the column will be lost.
  - Added the required column `firstQuestion` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondQuestion` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "passion",
DROP COLUMN "teamwork",
ADD COLUMN     "firstQuestion" TEXT NOT NULL,
ADD COLUMN     "secondQuestion" TEXT NOT NULL;
