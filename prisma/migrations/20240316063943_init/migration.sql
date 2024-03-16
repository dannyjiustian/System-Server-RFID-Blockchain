/*
  Warnings:

  - Made the column `status` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "status" SET NOT NULL;
