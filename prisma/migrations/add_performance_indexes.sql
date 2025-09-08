-- Add performance indexes for optimized queries
-- These indexes will improve performance for applicant loading and admin queries

-- Add index on Application.id for faster applicant lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Application_id_idx" ON "Application"("id");

-- Add compound index for applicant filtering and sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Application_status_submittedAt_idx" ON "Application"("status", "submittedAt");

-- Add index for meeting times joins
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ApplicantTime_applicantId_gridTime_idx" ON "ApplicantTime"("applicantId", "gridTime");

-- Add index for resume optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Application_resumeId_idx" ON "Application"("resumeId");

-- Add index for officer availability queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "OfficerTime_officerId_gridTime_idx" ON "OfficerTime"("officerId", "gridTime");

-- Add index for user email lookups (used in authentication)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "User_email_idx" ON "User"("email");