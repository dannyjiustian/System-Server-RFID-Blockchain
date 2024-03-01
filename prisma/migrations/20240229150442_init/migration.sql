/*
  Warnings:

  - Added the required column `sensor_name` to the `hardwares` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hardwares" ADD COLUMN     "sensor_name" VARCHAR(100) NOT NULL;
