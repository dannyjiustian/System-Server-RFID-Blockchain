/*
  Warnings:

  - You are about to alter the column `id_rfid` on the `cards` table. The data in that column could be lost. The data in that column will be cast from `Char(36)` to `Char(16)`.

*/
-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "id_rfid" SET DATA TYPE CHAR(16);
