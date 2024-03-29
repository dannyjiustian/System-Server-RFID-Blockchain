/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Base64 } from "js-base64";
import bodyParser from "body-parser";
import mqtt from "mqtt";
import { responseServer500 } from "./response.config.js";

/**
 * English: configure read env
 * Indonesian: konfigurasi baca env
 */
dotenv.config();

/**
 * English: read file enviroment for url
 * Indonesian: baca file enviroment untuk url
 */
const typeDevelop = process.env.APP_LOCAL || "local";
const corsOriginServer = process.env.CORS_SERVER_PRODUCTION || "*";
const baseURL = process.env.BASE_URL_API_VERSION || "v1";
const secretAccessKeyJWT =
  Base64.encode(process.env.SECRET_ACCESS_KEY_JWT) || "changeAccessKey";
const secretRefreshKeyJWT =
  Base64.encode(process.env.SECRET_REFRESH_KEY_JWT) || "changeRefreshKey";
const secretSaltBycrpt = parseInt(process.env.SECRET_SALT_BYCRPT) || 0;
const portServerConfig = process.env.PORT_SERVER || 3000;
const hostMQTT = process.env.HOST_MQTT || "your mqtt broker url";
const portMQTT = process.env.PORT_MQTT || "your mqtt port";
const usernameMQTT = process.env.USERNAME_MQTT || "your mqtt broker username";
const passwordMQTT = process.env.PASSWORD_MQTT || "your mqtt broket password";

/**
 * English: add-on configuration
 * Indonesian: konfigurasi tambahan
 */

const corsServerConfig = {
  origin: typeDevelop === "production" ? corsOriginServer : "*",
};

const mqttClientConfig = {
  host: hostMQTT,
  port: portMQTT,
  protocol: "mqtts",
  username: usernameMQTT,
  password: passwordMQTT,
};

/**
 * English: functions that will be used in the server
 * Indonesian: fungsi-fungsi yang akan digunakan di server
 */
const notFound = (req, res) => {
  return responseServer500(res, "Something Wrong!, Check Again!");
};

const signAccessJWT = (payload) => {
  return jwt.sign(payload, secretAccessKeyJWT, {
    expiresIn: "1m",
    algorithm: "HS512",
  });
};

const verifAccessJWT = (token) => {
  return jwt.verify(token, secretAccessKeyJWT);
};

const signRefreshJWT = (payload) => {
  return jwt.sign(payload, secretRefreshKeyJWT, {
    expiresIn: "3d",
    algorithm: "HS512",
  });
};

const verifRefreshJWT = (token) => {
  return jwt.verify(token, secretRefreshKeyJWT);
};

const hash = (string) => {
  return bcrypt.hashSync(string, secretSaltBycrpt);
};

const verifHash = async (string, hash) => {
  return await bcrypt.compare(string, hash);
};

/**
 * English: configure express
 * Indonesian: konfigurasi express
 */
const serverExpress = express();

/**
 * English: configuration of modules used
 * Indonesian: konfigurasi modul yang dipakai
 */
serverExpress.use(cors(corsServerConfig));
serverExpress.use(bodyParser.json());
serverExpress.use(bodyParser.urlencoded({ extended: false }));
serverExpress.use(express.json());

/**
 * English: configure mqtt client
 * Indonesian: konfigurasi mqtt client
 */
const clientMqtt = mqtt.connect(mqttClientConfig);

/**
 * English: export configuration
 * Indonesian: export konfigurasi
 */
export {
  express,
  serverExpress,
  clientMqtt,
  cors,
  bodyParser,
  baseURL,
  portServerConfig,
  notFound,
  signAccessJWT,
  verifAccessJWT,
  signRefreshJWT,
  verifRefreshJWT,
  hash,
  verifHash,
};
