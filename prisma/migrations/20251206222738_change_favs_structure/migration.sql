/*
  Warnings:

  - You are about to drop the column `favId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `favId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `favId` on the `Track` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_favId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_favId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_favId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "favId";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "favId";

-- AlterTable
ALTER TABLE "Fav" ADD COLUMN     "albums" TEXT[],
ADD COLUMN     "artists" TEXT[],
ADD COLUMN     "tracks" TEXT[];

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "favId";
