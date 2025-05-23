/*
  Warnings:

  - Made the column `idUser` on table `Suggestion` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Suggestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "idUser" INTEGER NOT NULL,
    CONSTRAINT "Suggestion_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Suggestion" ("createdAt", "description", "id", "idUser", "title", "updateAt") SELECT "createdAt", "description", "id", "idUser", "title", "updateAt" FROM "Suggestion";
DROP TABLE "Suggestion";
ALTER TABLE "new_Suggestion" RENAME TO "Suggestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
