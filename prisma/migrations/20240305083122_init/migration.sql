/*
  Warnings:

  - Made the column `type` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "type" SET NOT NULL;
