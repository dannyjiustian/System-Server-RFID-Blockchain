-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_card_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "id_card" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_card_fkey" FOREIGN KEY ("id_card") REFERENCES "cards"("id_card") ON DELETE SET NULL ON UPDATE CASCADE;
