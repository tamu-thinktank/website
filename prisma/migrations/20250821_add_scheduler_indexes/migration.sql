-- CreateIndex for Interview table - optimize scheduler queries
CREATE INDEX IF NOT EXISTS "Interview_interviewerId_startTime_endTime_idx" ON "Interview"("interviewerId", "startTime", "endTime");

-- CreateIndex for Interview table - optimize time-based lookups
CREATE INDEX IF NOT EXISTS "Interview_startTime_endTime_idx" ON "Interview"("startTime", "endTime");

-- CreateIndex for InterviewerBusyTime - optimize busy time lookups by date range
CREATE INDEX IF NOT EXISTS "InterviewerBusyTime_interviewerId_startTime_endTime_idx" ON "InterviewerBusyTime"("interviewerId", "startTime", "endTime");

-- CreateIndex for User table - optimize interviewer queries with target teams
CREATE INDEX IF NOT EXISTS "User_targetTeams_idx" ON "User" USING GIN("targetTeams");

-- CreateIndex for Application table - optimize applicant lookups by status and type
CREATE INDEX IF NOT EXISTS "Application_status_applicationType_idx" ON "Application"("status", "applicationType");

-- CreateIndex for Application table - optimize UIN lookups
CREATE INDEX IF NOT EXISTS "Application_uin_idx" ON "Application"("uin");