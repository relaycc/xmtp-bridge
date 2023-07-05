/*
  Warnings:

  - You are about to drop the column `httpUrl` on the `Bridge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[forwardHandlerId]` on the table `Bridge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `canaryAddress` to the `Bridge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forwardHandlerId` to the `Bridge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bridge" DROP COLUMN "httpUrl",
ADD COLUMN     "canaryAddress" TEXT NOT NULL,
ADD COLUMN     "forwardHandlerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ForwardHandler" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "httpUrl" TEXT NOT NULL,
    "isBot" BOOLEAN NOT NULL,

    CONSTRAINT "ForwardHandler_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bridge_forwardHandlerId_key" ON "Bridge"("forwardHandlerId");

-- AddForeignKey
ALTER TABLE "Bridge" ADD CONSTRAINT "Bridge_forwardHandlerId_fkey" FOREIGN KEY ("forwardHandlerId") REFERENCES "ForwardHandler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
