/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import { express, baseURL, notFound } from "../configs/server.config.js";
import user from "../controllers/user.controller.js";
import hardware from "../controllers/hardware.controller.js";
import card from "../controllers/card.controller.js";
import outlet from "../controllers/outlet.controller.js";
import transaction from "../controllers/transaction.controller.js";
import {
  checkVerifAccess,
  checkVerifRefresh,
} from "../controllers/verifToken.controller.js";

/**
 * English: call the router function in express
 * Indonesian: panggil fungsi router yang ada di express
 */
const route = express.Router();

/**
 * English: defines the url endpoint that will be used
 * Indonesian: mendefinisikan endpoint url yang akan digunakan
 */
const basicURI = `/api/${baseURL}`;

/**
 * English: endpoint url for user
 * Indonesian: endpoint url untuk user
 */
route.post(`${basicURI}/login`, user.login);
route.post(`${basicURI}/register`, user.register);
route.post(`${basicURI}/reset`, user.reset);
route.put(`${basicURI}/update`, user.update);

/**
 * English: endpoint url for refresh token
 * Indonesian: endpoint url untuk refresh token
 */
route.get(`${basicURI}/refresh-token`, checkVerifRefresh, user.refreshToken);

/**
 * English: endpoint url for hardware
 * Indonesian: endpoint url untuk hardware
 */
route.get(`${basicURI}/hardware/`, hardware.index);
route.get(`${basicURI}/hardware/:id_hardware`, hardware.show);
route.get(`${basicURI}/hardware/id-user/:id_user`, hardware.showByUser); // tmp remove validation jwt
route.post(`${basicURI}/hardware/save`, hardware.store);
route.put(`${basicURI}/hardware/:id_hardware/update`, hardware.update);
route.delete(`${basicURI}/hardware/:id_hardware`, hardware.destroy);

/**
 * English: endpoint url for card
 * Indonesian: endpoint url untuk card
 */
route.get(`${basicURI}/card/`, card.index);
route.get(`${basicURI}/card/:id_card`, card.show);
route.get(`${basicURI}/card/check/:id_rfid`, checkVerifAccess, card.searchCard);
route.get(
  `${basicURI}/card/id-user/:id_user`,
  checkVerifAccess,
  card.showByUser
);
route.post(`${basicURI}/card/save`, checkVerifAccess, card.store);
route.put(`${basicURI}/card/:id_card/update`, checkVerifAccess, card.update);
route.delete(`${basicURI}/card/:id_card`, card.destroy);

/**
 * English: endpoint url for outlet
 * Indonesian: endpoint url untuk outlet
 */
route.get(`${basicURI}/outlet/`, outlet.index);
route.get(`${basicURI}/outlet/:id_outlet`, outlet.show);
route.get(`${basicURI}/outlet/id-user/:id_user`, outlet.showByUser); // tmp remove validation jwt
route.post(`${basicURI}/outlet/save`, outlet.store); // tmp remove validation jwt
route.put(`${basicURI}/outlet/:id_outlet/update`, outlet.update); // tmp remove validation jwt

/**
 * English: endpoint url for transaction
 * Indonesian: endpoint url untuk transaction
 */
route.get(`${basicURI}/transaction/`, transaction.index);
route.get(
  `${basicURI}/transaction/:id_transaction`,
  checkVerifAccess,
  transaction.show
);
route.get(
  `${basicURI}/transaction/id-user/:id_user`,
  checkVerifAccess,
  transaction.showByUser
);
route.post(`${basicURI}/transaction/save`, transaction.store); // tmp remove validation jwt
route.put(
  `${basicURI}/transaction/cancel/:id_transaction`,
  checkVerifAccess,
  transaction.cancel
);

/**
 * English: endpoint url for those not found
 * Indonesian: endpoint url untuk yang tidak ditemukan
 */
route.use("/", notFound);

/**
 * English: export route
 * Indonesian: export route
 */
export default route;
