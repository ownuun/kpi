-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "additionalEmails" TEXT,
    "phone" TEXT,
    "countryCode" TEXT,
    "jobTitle" TEXT,
    "company" TEXT,
    "city" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "avatarUrl" TEXT,
    "intro" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "domainUrl" TEXT,
    "employees" INTEGER,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "city" TEXT,
    "industry" TEXT,
    "annualRevenue" DECIMAL,
    "isIdealCustomer" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");
