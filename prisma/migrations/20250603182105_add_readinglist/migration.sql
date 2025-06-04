-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReadingHistory_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReadingHistory_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReadingList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idUser" INTEGER NOT NULL,
    CONSTRAINT "ReadingList_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReadingListBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idReadingList" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,
    CONSTRAINT "ReadingListBook_idReadingList_fkey" FOREIGN KEY ("idReadingList") REFERENCES "ReadingList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReadingListBook_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_idUser_idBook_key" ON "ReadingHistory"("idUser", "idBook");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingListBook_idReadingList_idBook_key" ON "ReadingListBook"("idReadingList", "idBook");
