/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Intern` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Location` table. All the data in the column will be lost.
  - The primary key for the `Scheduled_day` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Site_Manager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `site_ID` to the `Scheduled_day` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clock_in_time" DATETIME NOT NULL,
    "clock_out_time" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ABSENT',
    "request_status" TEXT DEFAULT 'PENDING',
    "reason" TEXT,
    "userID" TEXT NOT NULL,
    CONSTRAINT "Attendance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("clock_in_time", "clock_out_time", "id", "reason", "request_status", "status", "userID") SELECT "clock_in_time", "clock_out_time", "id", "reason", "request_status", "status", "userID" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
CREATE TABLE "new_Intern" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Intern_ID_fkey" FOREIGN KEY ("ID") REFERENCES "User" ("ID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Intern" ("ID") SELECT "ID" FROM "Intern";
DROP TABLE "Intern";
ALTER TABLE "new_Intern" RENAME TO "Intern";
CREATE TABLE "new_Location" (
    "location_ID" TEXT NOT NULL PRIMARY KEY,
    "location_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "operation_days" TEXT NOT NULL,
    "open_time" INTEGER NOT NULL,
    "close_time" INTEGER NOT NULL,
    "attendance_code" INTEGER NOT NULL,
    "local_ID" TEXT NOT NULL
);
INSERT INTO "new_Location" ("address", "attendance_code", "close_time", "local_ID", "location_ID", "location_name", "open_time", "operation_days") SELECT "address", "attendance_code", "close_time", "local_ID", "location_ID", "location_name", "open_time", "operation_days" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_location_name_key" ON "Location"("location_name");
CREATE UNIQUE INDEX "Location_address_key" ON "Location"("address");
CREATE UNIQUE INDEX "Location_local_ID_key" ON "Location"("local_ID");
CREATE TABLE "new_Scheduled_day" (
    "shift_ID" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "shift_start" INTEGER NOT NULL,
    "shift_end" INTEGER NOT NULL,
    "site_ID" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'on_site',
    "userID" TEXT NOT NULL,
    CONSTRAINT "Scheduled_day_site_ID_fkey" FOREIGN KEY ("site_ID") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Scheduled_day_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduled_day" ("date", "shift_ID", "shift_end", "shift_start", "status", "userID") SELECT "date", "shift_ID", "shift_end", "shift_start", "status", "userID" FROM "Scheduled_day";
DROP TABLE "Scheduled_day";
ALTER TABLE "new_Scheduled_day" RENAME TO "Scheduled_day";
CREATE TABLE "new_Site_Manager" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Site_Manager_ID_fkey" FOREIGN KEY ("ID") REFERENCES "User" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Site_Manager_ID_fkey" FOREIGN KEY ("ID") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Site_Manager" ("ID") SELECT "ID" FROM "Site_Manager";
DROP TABLE "Site_Manager";
ALTER TABLE "new_Site_Manager" RENAME TO "Site_Manager";
CREATE TABLE "new_User" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "works_At" TEXT NOT NULL,
    CONSTRAINT "User_works_At_fkey" FOREIGN KEY ("works_At") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("ID", "user_email", "user_name", "user_phone", "works_At") SELECT "ID", "user_email", "user_name", "user_phone", "works_At" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
CREATE UNIQUE INDEX "User_user_phone_key" ON "User"("user_phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
