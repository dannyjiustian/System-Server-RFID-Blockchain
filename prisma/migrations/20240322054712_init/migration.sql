/*
  Warnings:

  - Made the column `id_card` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_card_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_outlet_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "id_card" SET NOT NULL,
ALTER COLUMN "id_outlet" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_card_fkey" FOREIGN KEY ("id_card") REFERENCES "cards"("id_card") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlets"("id_outlet") ON DELETE SET NULL ON UPDATE CASCADE;
