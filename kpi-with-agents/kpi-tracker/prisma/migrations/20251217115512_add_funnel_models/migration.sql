-- CreateTable
CREATE TABLE "sns_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "postId" TEXT,
    "content" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "businessLineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sns_posts_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "landing_visits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "visitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOnPage" INTEGER,
    "convertedToLead" BOOLEAN NOT NULL DEFAULT false,
    "snsPostId" TEXT,
    "leadId" TEXT,
    "businessLineId" TEXT NOT NULL,
    CONSTRAINT "landing_visits_snsPostId_fkey" FOREIGN KEY ("snsPostId") REFERENCES "sns_posts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "landing_visits_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "landing_visits_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "city" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "businessLineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leads_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "location" TEXT,
    "calendarEventId" TEXT,
    "meetingLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "leadId" TEXT NOT NULL,
    "businessLineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "meetings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meetings_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "stage" TEXT NOT NULL DEFAULT 'PROPOSAL',
    "probability" INTEGER,
    "expectedCloseDate" DATETIME,
    "actualCloseDate" DATETIME,
    "depositExpectedAt" DATETIME,
    "depositConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "depositAmount" REAL,
    "depositedAt" DATETIME,
    "hasPoc" BOOLEAN NOT NULL DEFAULT false,
    "pocStartDate" DATETIME,
    "pocEndDate" DATETIME,
    "pocStatus" TEXT,
    "isSubscription" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionStart" DATETIME,
    "subscriptionEnd" DATETIME,
    "leadId" TEXT NOT NULL,
    "businessLineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "deals_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "deals_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "bounceCount" INTEGER NOT NULL DEFAULT 0,
    "openRate" REAL,
    "clickRate" REAL,
    "replyRate" REAL,
    "businessLineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "email_campaigns_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "sns_posts_businessLineId_idx" ON "sns_posts"("businessLineId");

-- CreateIndex
CREATE INDEX "sns_posts_platform_idx" ON "sns_posts"("platform");

-- CreateIndex
CREATE INDEX "sns_posts_publishedAt_idx" ON "sns_posts"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "landing_visits_leadId_key" ON "landing_visits"("leadId");

-- CreateIndex
CREATE INDEX "landing_visits_businessLineId_idx" ON "landing_visits"("businessLineId");

-- CreateIndex
CREATE INDEX "landing_visits_utmSource_idx" ON "landing_visits"("utmSource");

-- CreateIndex
CREATE INDEX "landing_visits_visitedAt_idx" ON "landing_visits"("visitedAt");

-- CreateIndex
CREATE INDEX "landing_visits_convertedToLead_idx" ON "landing_visits"("convertedToLead");

-- CreateIndex
CREATE INDEX "leads_businessLineId_idx" ON "leads"("businessLineId");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "meetings_leadId_idx" ON "meetings"("leadId");

-- CreateIndex
CREATE INDEX "meetings_businessLineId_idx" ON "meetings"("businessLineId");

-- CreateIndex
CREATE INDEX "meetings_scheduledAt_idx" ON "meetings"("scheduledAt");

-- CreateIndex
CREATE INDEX "meetings_status_idx" ON "meetings"("status");

-- CreateIndex
CREATE INDEX "deals_leadId_idx" ON "deals"("leadId");

-- CreateIndex
CREATE INDEX "deals_businessLineId_idx" ON "deals"("businessLineId");

-- CreateIndex
CREATE INDEX "deals_stage_idx" ON "deals"("stage");

-- CreateIndex
CREATE INDEX "deals_expectedCloseDate_idx" ON "deals"("expectedCloseDate");

-- CreateIndex
CREATE INDEX "email_campaigns_businessLineId_idx" ON "email_campaigns"("businessLineId");

-- CreateIndex
CREATE INDEX "email_campaigns_status_idx" ON "email_campaigns"("status");

-- CreateIndex
CREATE INDEX "email_campaigns_sentAt_idx" ON "email_campaigns"("sentAt");
