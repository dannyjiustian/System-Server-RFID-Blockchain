/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import { express, baseURL, notFound } from "../configs/server.config.js";
import user from "../controllers/user.controller.js";
import hardware from "../controllers/hardware.controller.js";
import { checkVerifRefresh } from "../controllers/verifToken.controller.js";

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
route.post(`${basicURI}/hardware/save`, hardware.store);
route.put(`${basicURI}/hardware/:id_hardware/update`, hardware.update);
route.delete(`${basicURI}/hardware/:id_hardware`, hardware.destroy);

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
