/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import joi from "joi";

/**
 * English: functions that will be used for validation
 * Indonesian: fungsi-fungsi yang akan digunakan untuk validasi
 */
const validateUserLogin = (requestData) => {
  const userLoginSchema = joi
    .object({
      username: joi.string().case("lower").required().max(50),
      password: joi.string().required().max(200).min(8),
    })
    .options({ abortEarly: false });
  return userLoginSchema.validate(requestData);
};

const validateUserReset = (requestData) => {
  const userResetSchema = joi
    .object({
      email: joi.string().required().email(),
      username: joi.string().case("lower").required().max(50),
      password: joi.string().required().max(200).min(8),
    })
    .options({ abortEarly: false });
  return userResetSchema.validate(requestData);
};

const validateUserRegister = (requestData) => {
  const userRegisterSchema = joi
    .object({
      name: joi.string().required().max(100),
      email: joi.string().required().email(),
      username: joi.string().case("lower").required().max(50),
      password: joi.string().required().max(200).min(8),
      role: joi.number().required(),
    })
    .options({ abortEarly: false });
  return userRegisterSchema.validate(requestData);
};

const validateUserUpdate = (requestData) => {
  const userUpdateSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
      name: joi.string().required().max(100),
      email: joi.string().required().email(),
      username: joi.string().case("lower").required().max(50),
    })
    .options({ abortEarly: false });
  return userUpdateSchema.validate(requestData);
};

const validateHardwareStore = (requestData) => {
  const hardwareStoreSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
      sn_sensor: joi.string().required().max(10),
      name: joi.string().required().max(100),
      is_active: joi.boolean().required(),
    })
    .options({ abortEarly: false });
  return hardwareStoreSchema.validate(requestData);
};

const validateUUIDHardware = (requestData) => {
  const uUIDHardwareSchema = joi
    .object({
      id_hardware: joi.string().required().uuid(),
    })
    .options({ abortEarly: false });
  return uUIDHardwareSchema.validate(requestData);
};

const validateHardwareUpdate = (requestData) => {
  const updateHardwareSchema = joi
    .object({
      name: joi.string().max(100).required(),
    })
    .options({ abortEarly: false });
  return updateHardwareSchema.validate(requestData);
};

const validateCardStore = (requestData) => {
  const cardStoreSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
      id_rfid: joi.string().required().max(24),
      balance: joi.number().required(),
    })
    .options({ abortEarly: false });
  return cardStoreSchema.validate(requestData);
};
const validateCardRfid = (requestData) => {
  const cardRfidSchema = joi
    .object({
      id_rfid: joi.string().required().max(24),
    })
    .options({ abortEarly: false });
  return cardRfidSchema.validate(requestData);
};

const validateUUIDCard = (requestData) => {
  const uUIDCardSchema = joi
    .object({
      id_card: joi.string().required().uuid(),
    })
    .options({ abortEarly: false });
  return uUIDCardSchema.validate(requestData);
};

const validateUUIDUser = (requestData) => {
  const uUIDUserSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
    })
    .options({ abortEarly: false });
  return uUIDUserSchema.validate(requestData);
};

const validateCardUpdate = (requestData) => {
  const updateCardSchema = joi
    .object({
      balance: joi.number().required(),
    })
    .options({ abortEarly: false });
  return updateCardSchema.validate(requestData);
};

const validateOutletStore = (requestData) => {
  const outletStoreSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
      balance: joi.number().required(),
      smart_contract: joi.string().required().max(42),
    })
    .options({ abortEarly: false });
  return outletStoreSchema.validate(requestData);
};

const validateUUIDOutlet = (requestData) => {
  const uUIDOutletSchema = joi
    .object({
      id_outlet: joi.string().required().uuid(),
    })
    .options({ abortEarly: false });
  return uUIDOutletSchema.validate(requestData);
};

const validateOutletUpdate = (requestData) => {
  const updateOutletSchema = joi
    .object({
      balance: joi.number().required(),
    })
    .options({ abortEarly: false });
  return updateOutletSchema.validate(requestData);
};

const validateTransactionStore = (requestData) => {
  const transactionStoreSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
      id_hardware: joi.string().optional().uuid(),
      id_card: joi.string().required().uuid(),
      id_outlet: joi.string().optional().uuid(),
      type: joi.number().required().max(1),
      txn_hash: joi.string().optional().max(42),
      status: joi.string().optional(),
      total_payment: joi.number().required(),
    })
    .options({ abortEarly: false });
  return transactionStoreSchema.validate(requestData);
};

const validateUUIDTransaction = (requestData) => {
  const uUIDTransactionSchema = joi
    .object({
      id_transaction: joi.string().required().uuid(),
    })
    .options({ abortEarly: false });
  return uUIDTransactionSchema.validate(requestData);
};
/**
 * English: export validation configuration
 * Indonesian: export konfigurasi validasi
 */
export {
  validateUserLogin,
  validateUserReset,
  validateUserRegister,
  validateUserUpdate,
  validateHardwareStore,
  validateUUIDHardware,
  validateHardwareUpdate,
  validateCardStore,
  validateCardRfid,
  validateUUIDCard,
  validateUUIDUser,
  validateCardUpdate,
  validateOutletStore,
  validateUUIDOutlet,
  validateOutletUpdate,
  validateTransactionStore,
  validateUUIDTransaction,
};
