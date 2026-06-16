-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('PHOTO', 'PHONE_ID', 'PARTNER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "logoUrl" TEXT,
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT,
    "storeNameCustom" TEXT,
    "type" "CardType" NOT NULL,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPhoto" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "barcodeValue" TEXT,
    "barcodeFormat" TEXT,

    CONSTRAINT "CardPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPhoneId" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "cardNumber" TEXT,

    CONSTRAINT "CardPhoneId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardPartner" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "pointsBalance" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3),

    CONSTRAINT "CardPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CardPhoto_cardId_key" ON "CardPhoto"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardPhoneId_cardId_key" ON "CardPhoneId"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardPartner_cardId_key" ON "CardPartner"("cardId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPhoto" ADD CONSTRAINT "CardPhoto_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPhoneId" ADD CONSTRAINT "CardPhoneId_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardPartner" ADD CONSTRAINT "CardPartner_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
