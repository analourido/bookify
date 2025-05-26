/*
  Warnings:

  - You are about to drop the column `idAdmin` on the `Club` table. All the data in the column will be lost.
  - Added the required column `idUser` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idUser" INTEGER NOT NULL,
    CONSTRAINT "Club_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
