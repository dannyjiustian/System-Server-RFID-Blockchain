/*
  Warnings:

  - You are about to drop the column `sensor_name` on the `hardwares` table. All the data in the column will be lost.
  - Added the required column `name` to the `hardwares` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hardwares" DROP COLUMN "sensor_name",
ADD COLUMN     "name" VARCHAR(100) NOT NULL;
