-- CreateTable
CREATE TABLE "business_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "targetValue" REAL,
    "currentValue" REAL,
    "measurementType" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "businessLineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "kpis_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "data_points" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "source" TEXT,
    "kpiId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "data_points_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "kpis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layout" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "businessLineId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dashboards_businessLineId_fkey" FOREIGN KEY ("businessLineId") REFERENCES "business_lines" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dashboard_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "config" TEXT,
    "position" TEXT,
    "dashboardId" TEXT NOT NULL,
    "kpiId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dashboard_items_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dashboard_items_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "kpis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "business_lines_name_key" ON "business_lines"("name");

-- CreateIndex
CREATE INDEX "kpis_businessLineId_idx" ON "kpis"("businessLineId");

-- CreateIndex
CREATE INDEX "kpis_isActive_idx" ON "kpis"("isActive");

-- CreateIndex
CREATE INDEX "kpis_measurementType_idx" ON "kpis"("measurementType");

-- CreateIndex
CREATE INDEX "data_points_kpiId_idx" ON "data_points"("kpiId");

-- CreateIndex
CREATE INDEX "data_points_timestamp_idx" ON "data_points"("timestamp");

-- CreateIndex
CREATE INDEX "data_points_kpiId_timestamp_idx" ON "data_points"("kpiId", "timestamp");

-- CreateIndex
CREATE INDEX "dashboards_businessLineId_idx" ON "dashboards"("businessLineId");

-- CreateIndex
CREATE INDEX "dashboards_isDefault_idx" ON "dashboards"("isDefault");

-- CreateIndex
CREATE INDEX "dashboard_items_dashboardId_idx" ON "dashboard_items"("dashboardId");

-- CreateIndex
CREATE INDEX "dashboard_items_kpiId_idx" ON "dashboard_items"("kpiId");
