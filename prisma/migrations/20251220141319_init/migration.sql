-- CreateTable
CREATE TABLE "Advertisement" (
    "id" TEXT NOT NULL,
    "video" TEXT,
    "text" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);
