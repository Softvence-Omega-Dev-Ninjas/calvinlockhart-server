/*
  Warnings:

  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TopicDestination" AS ENUM ('PRECEPT_TOPIC', 'LESSON_PRECEPTS', 'FAVORITES');

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_topicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Topic" ADD COLUMN     "destination" "public"."TopicDestination" NOT NULL DEFAULT 'PRECEPT_TOPIC';

-- DropTable
DROP TABLE "public"."Favorite";
