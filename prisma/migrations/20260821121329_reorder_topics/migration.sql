-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Topic_userId_destination_order_idx" ON "Topic"("userId", "destination", "order");
