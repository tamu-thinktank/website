-- AlterTable
ALTER TABLE "InterviewNote" ADD COLUMN     "assignedTeam" TEXT,
ADD COLUMN     "interviewerId" TEXT;

-- CreateIndex
CREATE INDEX "InterviewNote_interviewerId_idx" ON "InterviewNote"("interviewerId");

-- AddForeignKey
ALTER TABLE "InterviewNote" ADD CONSTRAINT "InterviewNote_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
