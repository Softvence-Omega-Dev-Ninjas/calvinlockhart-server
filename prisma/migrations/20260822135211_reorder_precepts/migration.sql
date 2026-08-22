-- AlterTable
ALTER TABLE "Precept" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Precept_topicId_order_idx" ON "Precept"("topicId", "order");
