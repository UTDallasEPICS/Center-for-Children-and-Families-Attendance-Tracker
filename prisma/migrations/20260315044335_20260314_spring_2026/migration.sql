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
    "attendance_code" TEXT NOT NULL
);
INSERT INTO "new_Location" ("address", "attendance_code", "close_time", "location_ID", "location_name", "open_time", "operation_days") SELECT "address", "attendance_code", "close_time", "location_ID", "location_name", "open_time", "operation_days" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
