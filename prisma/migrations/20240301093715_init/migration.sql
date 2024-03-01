/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `outlets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "outlets_id_user_key" ON "outlets"("id_user");
