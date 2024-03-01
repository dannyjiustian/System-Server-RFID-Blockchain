/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import { verifRefreshJWT } from "../configs/server.config.js";
import { responseServer500 } from "../configs/response.config.js";

const checkVerifRefresh = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer)
    return responseServer500(res, "please enter bearer authentication");

  const token = bearer.split(" ")[1];
  try {
    const verif = verifRefreshJWT(token);
    req.id_user = verif.id_user;
    next();
  } catch (error) {
    responseServer500(
      res,
      "access token verification failed",
      Object.keys(error).length > 0 ? error : error.message
    );
  }
};

export { checkVerifRefresh };
