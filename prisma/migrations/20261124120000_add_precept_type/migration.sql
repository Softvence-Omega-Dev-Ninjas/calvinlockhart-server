-- CreateEnum
CREATE TYPE "PreceptType" AS ENUM ('SCRIPTURE', 'FREEFORM');

-- AlterTable
ALTER TABLE "Precept" ADD COLUMN     "type" "PreceptType" NOT NULL DEFAULT 'SCRIPTURE';
