/*
  Warnings:

  - You are about to drop the column `shift_end` on the `Scheduled_day` table. All the data in the column will be lost.
  - You are about to drop the column `shift_start` on the `Scheduled_day` table. All the data in the column will be lost.
  - Added the required column `shift_duration` to the `Scheduled_day` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scheduled_day" (
    "shift_ID" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "shift_duration" INTEGER NOT NULL,
    "site_ID" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'on_site',
    "userID" TEXT NOT NULL,
    CONSTRAINT "Scheduled_day_site_ID_fkey" FOREIGN KEY ("site_ID") REFERENCES "Location" ("location_ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Scheduled_day_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scheduled_day" ("date", "shift_ID", "site_ID", "status", "userID") SELECT "date", "shift_ID", "site_ID", "status", "userID" FROM "Scheduled_day";
DROP TABLE "Scheduled_day";
ALTER TABLE "new_Scheduled_day" RENAME TO "Scheduled_day";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
