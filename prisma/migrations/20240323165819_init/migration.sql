-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_card_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_hardware_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_outlet_fkey";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_hardware_fkey" FOREIGN KEY ("id_hardware") REFERENCES "hardwares"("id_hardware") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_card_fkey" FOREIGN KEY ("id_card") REFERENCES "cards"("id_card") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlets"("id_outlet") ON DELETE RESTRICT ON UPDATE CASCADE;
