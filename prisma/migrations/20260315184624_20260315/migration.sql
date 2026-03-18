-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clock_in_time" DATETIME,
    "clock_out_time" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ABSENT',
    "request_status" TEXT DEFAULT 'PENDING',
    "reason" TEXT,
    "userID" TEXT NOT NULL,
    CONSTRAINT "Attendance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("clock_in_time", "clock_out_time", "id", "reason", "request_status", "status", "userID") SELECT "clock_in_time", "clock_out_time", "id", "reason", "request_status", "status", "userID" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
