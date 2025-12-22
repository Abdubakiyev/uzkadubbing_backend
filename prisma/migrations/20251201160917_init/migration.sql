/*
  Warnings:

  - You are about to drop the column `userId` on the `EmailVerification` table. All the data in the column will be lost.
  - Added the required column `email` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmailVerification" DROP CONSTRAINT "EmailVerification_userId_fkey";

-- AlterTable
ALTER TABLE "EmailVerification" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL;
