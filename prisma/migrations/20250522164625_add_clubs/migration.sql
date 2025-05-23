-- AlterTable
ALTER TABLE "Book" ADD COLUMN "coverUrl" TEXT;

-- CreateTable
CREATE TABLE "Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idAdmin" INTEGER NOT NULL,
    CONSTRAINT "Club_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClubMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idClub" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubMember_idClub_fkey" FOREIGN KEY ("idClub") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClubMember_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClubBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idClub" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "month" TEXT,
    CONSTRAINT "ClubBook_idClub_fkey" FOREIGN KEY ("idClub") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClubBook_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_idClub_idUser_key" ON "ClubMember"("idClub", "idUser");
