/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import {
  serverExpress,
  portServerConfig,
} from "./api/v1/configs/server.config.js";
import route from "./api/v1/routes/routes.js";

/**
 * English: configuration of modules used
 * Indonesian: konfigurasi modul yang dipakai
 */
serverExpress.use(route);

serverExpress.listen(portServerConfig, () => {
  console.log(`Server runing on http://localhost:${portServerConfig}`);
});
