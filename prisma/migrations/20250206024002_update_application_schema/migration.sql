-- CreateEnum
CREATE TYPE "Year" AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'GRADUATE');

-- CreateEnum
CREATE TYPE "Challenge" AS ENUM ('TSGC', 'AIAA');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InterestLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "CommitmentType" AS ENUM ('CURRENT', 'PLANNED');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('MSC_OPEN_HOUSE', 'ESO_OPEN_HOUSE', 'MULTISECTION', 'REFERRAL', 'INSTAGRAM', 'FLYERS');

-- CreateEnum
CREATE TYPE "Pronoun" AS ENUM ('HE_HIM', 'SHE_HER', 'THEY_THEM', 'OTHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'OTHER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "targetTeams" "Challenge"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "OfficerTime" (
    "gridTime" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "selectedAt" TEXT NOT NULL,

    CONSTRAINT "OfficerTime_pkey" PRIMARY KEY ("gridTime","officerId")
);

-- CreateTable
CREATE TABLE "ApplicantTime" (
    "gridTime" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "ApplicantTime_pkey" PRIMARY KEY ("gridTime","applicantId")
);

-- CreateTable
CREATE TABLE "Commitment" (
    "name" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "type" "CommitmentType" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "Commitment_pkey" PRIMARY KEY ("name","applicantId","type")
);

-- CreateTable
CREATE TABLE "TeamPreference" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "interest" "InterestLevel" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "TeamPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchPreference" (
    "id" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "interest" "InterestLevel" NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "ResearchPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "location" TEXT,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "preferredPronoun" TEXT,
    "gender" TEXT,
    "uin" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "altEmail" TEXT,
    "phone" TEXT NOT NULL,
    "year" "Year" NOT NULL,
    "major" TEXT NOT NULL,
    "currentClasses" TEXT[],
    "nextClasses" TEXT[],
    "meetings" BOOLEAN NOT NULL,
    "weeklyCommitment" BOOLEAN NOT NULL,
    "referral" "ReferralSource"[],
    "passion" TEXT NOT NULL,
    "teamwork" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "OfficerTime_officerId_idx" ON "OfficerTime"("officerId");

-- CreateIndex
CREATE INDEX "ApplicantTime_applicantId_idx" ON "ApplicantTime"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_uin_key" ON "Application"("uin");

-- CreateIndex
CREATE UNIQUE INDEX "Application_email_key" ON "Application"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficerTime" ADD CONSTRAINT "OfficerTime_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantTime" ADD CONSTRAINT "ApplicantTime_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commitment" ADD CONSTRAINT "Commitment_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPreference" ADD CONSTRAINT "TeamPreference_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPreference" ADD CONSTRAINT "ResearchPreference_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
