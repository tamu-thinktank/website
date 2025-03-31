-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "interviewStage" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "isPlaceholder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "placeholderName" TEXT,
ADD COLUMN     "teamId" TEXT,
ALTER COLUMN "applicantId" DROP NOT NULL;
