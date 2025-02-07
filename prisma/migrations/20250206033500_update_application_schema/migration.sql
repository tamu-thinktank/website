/*
  Warnings:

  - You are about to drop the column `areaName` on the `ResearchPreference` table. All the data in the column will be lost.
  - You are about to drop the column `teamName` on the `TeamPreference` table. All the data in the column will be lost.
  - Added the required column `researchAreaId` to the `ResearchPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `TeamPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResearchPreference" DROP COLUMN "areaName",
ADD COLUMN     "researchAreaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeamPreference" DROP COLUMN "teamName",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "ResearchArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchArea_name_key" ON "ResearchArea"("name");

-- AddForeignKey
ALTER TABLE "ResearchArea" ADD CONSTRAINT "ResearchArea_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPreference" ADD CONSTRAINT "TeamPreference_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPreference" ADD CONSTRAINT "ResearchPreference_researchAreaId_fkey" FOREIGN KEY ("researchAreaId") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
