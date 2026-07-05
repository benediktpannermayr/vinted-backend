/*
  Warnings:

  - You are about to drop the column `brand` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `items` table. All the data in the column will be lost.
  - Added the required column `productId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "brand",
DROP COLUMN "category",
DROP COLUMN "title",
ADD COLUMN     "productId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "items_productId_idx" ON "items"("productId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
