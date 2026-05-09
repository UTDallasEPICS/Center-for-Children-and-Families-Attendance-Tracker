/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `reason` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `request_status` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Attendance` table. All the data in the column will be lost.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `close_time` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `location_ID` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `open_time` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `operation_days` on the `Location` table. All the data in the column will be lost.
  - The primary key for the `Scheduled_day` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `shift_ID` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `shift_duration` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Scheduled_day` table. All the data in the column will be lost.
  - The primary key for the `Site_Manager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Site_Manager` table. All the data in the column will be lost.
  - Added the required column `internID` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift_ID` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `Intern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Intern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_phone` to the `Intern` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Location` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `end_time` to the `Scheduled_day` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Scheduled_day` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `start_time` to the `Scheduled_day` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Site_Manager` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `intern_ID` to the `Site_Manager` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Shift_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_ID" TEXT NOT NULL,
    "picked_up_by_ID" TEXT,
    CONSTRAINT "Shift_Request_created_by_ID_fkey" FOREIGN KEY ("created_by_ID") REFERENCES "Intern" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Shift_Request_picked_up_by_ID_fkey" FOREIGN KEY ("picked_up_by_ID") REFERENCES "Intern" ("ID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LocationToSite_Manager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LocationToSite_Manager_A_fkey" FOREIGN KEY ("A") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LocationToSite_Manager_B_fkey" FOREIGN KEY ("B") REFERENCES "Site_Manager" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clock_in_time" DATETIME,
    "clock_out_time" DATETIME,
    "status" TEXT DEFAULT 'ABSENT',
    "internID" TEXT NOT NULL,
    "shift_ID" TEXT NOT NULL,
    "shift_request_ID" TEXT,
    CONSTRAINT "Attendance_internID_fkey" FOREIGN KEY ("internID") REFERENCES "Intern" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_shift_ID_fkey" FOREIGN KEY ("shift_ID") REFERENCES "Scheduled_day" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_shift_request_ID_fkey" FOREIGN KEY ("shift_request_ID") REFERENCES "Shift_Request" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("clock_in_time", "clock_out_time", "id", "status") SELECT "clock_in_time", "clock_out_time", "id", "status" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
CREATE TABLE "new_Intern" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "next_shift_ID" TEXT,
    CONSTRAINT "Intern_next_shift_ID_fkey" FOREIGN KEY ("next_shift_ID") REFERENCES "Scheduled_day" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Intern" ("ID") SELECT "ID" FROM "Intern";
DROP TABLE "Intern";
ALTER TABLE "new_Intern" RENAME TO "Intern";
CREATE TABLE "new_Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "location_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "attendance_code" TEXT,
    "code_expires_at" DATETIME
);
INSERT INTO "new_Location" ("address", "attendance_code", "location_name") SELECT "address", "attendance_code", "location_name" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE TABLE "new_Scheduled_day" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "site_ID" TEXT NOT NULL,
    CONSTRAINT "Scheduled_day_site_ID_fkey" FOREIGN KEY ("site_ID") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduled_day" ("site_ID") SELECT "site_ID" FROM "Scheduled_day";
DROP TABLE "Scheduled_day";
ALTER TABLE "new_Scheduled_day" RENAME TO "Scheduled_day";
CREATE TABLE "new_Site_Manager" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intern_ID" TEXT NOT NULL,
    CONSTRAINT "Site_Manager_intern_ID_fkey" FOREIGN KEY ("intern_ID") REFERENCES "Intern" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "Site_Manager";
ALTER TABLE "new_Site_Manager" RENAME TO "Site_Manager";
CREATE UNIQUE INDEX "Site_Manager_intern_ID_key" ON "Site_Manager"("intern_ID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToSite_Manager_AB_unique" ON "_LocationToSite_Manager"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToSite_Manager_B_index" ON "_LocationToSite_Manager"("B");
