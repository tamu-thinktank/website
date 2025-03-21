/*
  Warnings:

  - The values [BIOE,CHEM,CIVE,COMM,ECON,GEOE,GEOL,MARA,MATH,OPEN,PHYS,STAT] on the enum `Major` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Major_new" AS ENUM ('ENGR', 'AERO', 'AGSM', 'BAEN', 'BMEN', 'CHEN', 'CPEN', 'CSCE', 'CVEN', 'ECEN', 'ELEN', 'EVEN', 'IDIS', 'INEN', 'ISEN', 'MASE', 'MEEN', 'MMET', 'MXET', 'NUEN', 'OCEN', 'PETE', 'Other');
ALTER TABLE "Application" ALTER COLUMN "major" TYPE "Major_new" USING ("major"::text::"Major_new");
ALTER TYPE "Major" RENAME TO "Major_old";
ALTER TYPE "Major_new" RENAME TO "Major";
DROP TYPE "Major_old";
COMMIT;
