/*
  Warnings:

  - You are about to drop the column `local_ID` on the `Location` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Location" (
    "location_ID" TEXT NOT NULL PRIMARY KEY,
    "location_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "operation_days" TEXT NOT NULL,
    "open_time" INTEGER NOT NULL,
    "close_time" INTEGER NOT NULL,
    "attendance_code" INTEGER NOT NULL
);
INSERT INTO "new_Location" ("address", "attendance_code", "close_time", "location_ID", "location_name", "open_time", "operation_days") SELECT "address", "attendance_code", "close_time", "location_ID", "location_name", "open_time", "operation_days" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_location_name_key" ON "Location"("location_name");
CREATE UNIQUE INDEX "Location_address_key" ON "Location"("address");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
