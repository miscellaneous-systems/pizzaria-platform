-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MONEY', 'PIX', 'CARD');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MONEY',
ADD COLUMN     "tip" INTEGER NOT NULL DEFAULT 0;
