-- CreateTable
CREATE TABLE "Bridge" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ethAddress" TEXT NOT NULL,
    "hookToken" TEXT NOT NULL,

    CONSTRAINT "Bridge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bridge_ethAddress_key" ON "Bridge"("ethAddress");
