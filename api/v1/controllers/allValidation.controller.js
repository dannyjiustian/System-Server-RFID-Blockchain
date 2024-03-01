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
      name: joi.string().max(100),
      is_active: joi.boolean().required(),
    })
    .options({ abortEarly: false });
  return updateHardwareSchema.validate(requestData);
};

const validateCardStore = (requestData) => {
  const cardStoreSchema = joi
    .object({
      id_user: joi.string().required().uuid(),
      id_rfid: joi.string().required().max(16),
      balance: joi.number().required(),
      wallet_address: joi.string().required().max(42),
    })
    .options({ abortEarly: false });
  return cardStoreSchema.validate(requestData);
};

const validateUUIDCard = (requestData) => {
  const uUIDCardSchema = joi
    .object({
      id_card: joi.string().required().uuid(),
    })
    .options({ abortEarly: false });
  return uUIDCardSchema.validate(requestData);
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
/**
 * English: export validation configuration
 * Indonesian: export konfigurasi validasi
 */
export {
  validateUserLogin,
  validateUserRegister,
  validateUserUpdate,
  validateHardwareStore,
  validateUUIDHardware,
  validateHardwareUpdate,
  validateCardStore,
  validateUUIDCard,
  validateCardUpdate,
  validateOutletStore,
  validateUUIDOutlet,
  validateOutletUpdate
};
