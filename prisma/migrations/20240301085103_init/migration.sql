/*
  Warnings:

  - A unique constraint covering the columns `[id_rfid]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cards_id_rfid_key" ON "cards"("id_rfid");
