/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "categoryId",
ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Category";

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
