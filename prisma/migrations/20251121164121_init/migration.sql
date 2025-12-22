/*
  Warnings:

  - You are about to drop the column `code` on the `Anime` table. All the data in the column will be lost.
  - Added the required column `url` to the `Anime` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Anime_code_key";

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "code",
ADD COLUMN     "url" TEXT NOT NULL;
