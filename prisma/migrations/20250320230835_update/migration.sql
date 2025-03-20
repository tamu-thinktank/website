/*
  Warnings:

  - A unique constraint covering the columns `[uin,applicationType]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,applicationType]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Application_email_key";

-- DropIndex
DROP INDEX "Application_uin_key";

-- CreateIndex
CREATE UNIQUE INDEX "Application_uin_applicationType_key" ON "Application"("uin", "applicationType");

-- CreateIndex
CREATE UNIQUE INDEX "Application_email_applicationType_key" ON "Application"("email", "applicationType");
