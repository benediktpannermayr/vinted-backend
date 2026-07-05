/*
  Warnings:

  - You are about to drop the column `brands` on the `search_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `search_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `keyword` on the `search_profiles` table. All the data in the column will be lost.
  - Added the required column `productId` to the `search_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "sourceListingUrl" TEXT;

-- AlterTable
ALTER TABLE "marketplace_listings" ADD COLUMN     "color" TEXT,
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "search_profiles" DROP COLUMN "brands",
DROP COLUMN "categories",
DROP COLUMN "keyword",
ADD COLUMN     "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "productId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_userId_idx" ON "products"("userId");

-- CreateIndex
CREATE INDEX "marketplace_listings_productId_idx" ON "marketplace_listings"("productId");

-- CreateIndex
CREATE INDEX "search_profiles_productId_idx" ON "search_profiles"("productId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_profiles" ADD CONSTRAINT "search_profiles_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
