-- CreateTable
CREATE TABLE "User" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "location_ID" INTEGER NOT NULL,
    CONSTRAINT "User_ID_fkey" FOREIGN KEY ("ID") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Intern" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Intern_ID_fkey" FOREIGN KEY ("ID") REFERENCES "User" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Site_Manager" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Site_Manager_ID_fkey" FOREIGN KEY ("ID") REFERENCES "User" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Site_Manager_ID_fkey" FOREIGN KEY ("ID") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "location_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "operation_days" TEXT NOT NULL,
    "open_time" INTEGER NOT NULL,
    "close_time" INTEGER NOT NULL,
    "attendance_code" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clock_in_time" DATETIME NOT NULL,
    "clock_out_time" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ABSENT',
    "request_status" TEXT DEFAULT 'PENDING',
    "reason" TEXT,
    "userID" INTEGER NOT NULL,
    CONSTRAINT "Attendance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scheduled_day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "shift_start" INTEGER NOT NULL,
    "shift_end" INTEGER NOT NULL,
    "site_ID" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'on_site',
    "userID" INTEGER NOT NULL,
    CONSTRAINT "Scheduled_day_site_ID_fkey" FOREIGN KEY ("site_ID") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Scheduled_day_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_phone_key" ON "User"("user_phone");

-- CreateIndex
CREATE UNIQUE INDEX "Location_location_name_key" ON "Location"("location_name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_address_key" ON "Location"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Location_userId_key" ON "Location"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Scheduled_day_id_key" ON "Scheduled_day"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Scheduled_day_site_ID_key" ON "Scheduled_day"("site_ID");
