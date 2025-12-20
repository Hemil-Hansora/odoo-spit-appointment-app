/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "service" ADD COLUMN     "shareToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "service_shareToken_key" ON "service"("shareToken");
