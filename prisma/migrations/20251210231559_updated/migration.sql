/*
  Warnings:

  - The primary key for the `Scheduled_day` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `site_ID` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `location_ID` on the `User` table. All the data in the column will be lost.
  - Added the required column `local_ID` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift_ID` to the `Scheduled_day` table without a default value. This is not possible if the table is not empty.
  - Added the required column `works_At` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Location" (
    "location_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "operation_days" TEXT NOT NULL,
    "open_time" INTEGER NOT NULL,
    "close_time" INTEGER NOT NULL,
    "attendance_code" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "local_ID" INTEGER NOT NULL,
    CONSTRAINT "Location_local_ID_fkey" FOREIGN KEY ("local_ID") REFERENCES "Scheduled_day" ("shift_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("address", "attendance_code", "close_time", "location_ID", "location_name", "open_time", "operation_days", "userId") SELECT "address", "attendance_code", "close_time", "location_ID", "location_name", "open_time", "operation_days", "userId" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_location_name_key" ON "Location"("location_name");
CREATE UNIQUE INDEX "Location_address_key" ON "Location"("address");
CREATE UNIQUE INDEX "Location_userId_key" ON "Location"("userId");
CREATE UNIQUE INDEX "Location_local_ID_key" ON "Location"("local_ID");
CREATE TABLE "new_Scheduled_day" (
    "shift_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "shift_start" INTEGER NOT NULL,
    "shift_end" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'on_site',
    "userID" INTEGER NOT NULL,
    CONSTRAINT "Scheduled_day_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduled_day" ("date", "shift_end", "shift_start", "status", "userID") SELECT "date", "shift_end", "shift_start", "status", "userID" FROM "Scheduled_day";
DROP TABLE "Scheduled_day";
ALTER TABLE "new_Scheduled_day" RENAME TO "Scheduled_day";
CREATE UNIQUE INDEX "Scheduled_day_shift_ID_key" ON "Scheduled_day"("shift_ID");
CREATE TABLE "new_User" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "works_At" INTEGER NOT NULL,
    CONSTRAINT "User_works_At_fkey" FOREIGN KEY ("works_At") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("ID", "user_email", "user_name", "user_phone") SELECT "ID", "user_email", "user_name", "user_phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
CREATE UNIQUE INDEX "User_user_phone_key" ON "User"("user_phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
