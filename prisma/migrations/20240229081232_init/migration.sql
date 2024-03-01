-- CreateTable
CREATE TABLE "users" (
    "id_user" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "role" CHAR(1) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "hardwares" (
    "id_hardware" CHAR(36) NOT NULL,
    "id_user" CHAR(36) NOT NULL,
    "sn_sensor" CHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hardwares_pkey" PRIMARY KEY ("id_hardware")
);

-- CreateTable
CREATE TABLE "cards" (
    "id_card" CHAR(36) NOT NULL,
    "id_user" CHAR(36) NOT NULL,
    "id_rfid" CHAR(36) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "wallet_address" CHAR(42) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id_card")
);

-- CreateTable
CREATE TABLE "outlets" (
    "id_outlet" CHAR(36) NOT NULL,
    "id_user" CHAR(36) NOT NULL,
    "smart_contract" CHAR(42) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("id_outlet")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id_transaction" CHAR(36) NOT NULL,
    "id_user" CHAR(36) NOT NULL,
    "id_hardware" CHAR(36) NOT NULL,
    "id_card" CHAR(36) NOT NULL,
    "id_outlet" CHAR(36) NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "total_payment" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id_transaction")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hardwares_sn_sensor_key" ON "hardwares"("sn_sensor");

-- AddForeignKey
ALTER TABLE "hardwares" ADD CONSTRAINT "hardwares_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlets" ADD CONSTRAINT "outlets_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_hardware_fkey" FOREIGN KEY ("id_hardware") REFERENCES "hardwares"("id_hardware") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_card_fkey" FOREIGN KEY ("id_card") REFERENCES "cards"("id_card") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlets"("id_outlet") ON DELETE RESTRICT ON UPDATE CASCADE;
