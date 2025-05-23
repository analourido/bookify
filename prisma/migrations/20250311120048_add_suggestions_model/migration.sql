-- CreateTable
CREATE TABLE "Suggestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "idUser" INTEGER,
    CONSTRAINT "Suggestion_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
