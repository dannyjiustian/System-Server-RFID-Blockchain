/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import { verifAccessJWT, verifRefreshJWT } from "../configs/server.config.js";
import { responseServer401 } from "../configs/response.config.js";

const checkVerifAccess = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer)
    return responseServer401(res, "please enter bearer authentication");

  const token = bearer.split(" ")[1];
  try {
    const verif = verifAccessJWT(token);
    req.id_user = verif.id_user;
    next();
  } catch (error) {
    responseServer401(res, `access token verification failed, ${error.message}`);
  }
};

const checkVerifRefresh = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer)
    return responseServer401(res, "please enter bearer authentication");

  const token = bearer.split(" ")[1];
  try {
    const verif = verifRefreshJWT(token);
    req.id_user = verif.id_user;
    next();
  } catch (error) {
    responseServer401(res, `refresh token verification failed, ${error.message}`);
  }
};

export { checkVerifAccess, checkVerifRefresh };
