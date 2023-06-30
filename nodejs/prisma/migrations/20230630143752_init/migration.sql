/*
  Warnings:

  - The primary key for the `Bridge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `bootKey` to the `Bridge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `httpUrl` to the `Bridge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bridge" DROP CONSTRAINT "Bridge_pkey",
ADD COLUMN     "bootKey" TEXT NOT NULL,
ADD COLUMN     "httpUrl" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bridge_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bridge_id_seq";

-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bridgeId" TEXT NOT NULL,
    "heartbeat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instance_bridgeId_key" ON "Instance"("bridgeId");

-- AddForeignKey
ALTER TABLE "Instance" ADD CONSTRAINT "Instance_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
