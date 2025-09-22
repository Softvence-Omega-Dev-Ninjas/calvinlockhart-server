/*
  Warnings:

  - You are about to drop the column `topicId` on the `Note` table. All the data in the column will be lost.
  - Added the required column `preceptId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_topicId_fkey";

-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "topicId",
ADD COLUMN     "preceptId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_preceptId_fkey" FOREIGN KEY ("preceptId") REFERENCES "public"."Precept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
