/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Anime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Anime_code_key" ON "Anime"("code");
