/**
 * English: imports the modules used
 * Indonesian: mengimpor modul yang digunakan
 */
import { PrismaClient } from "@prisma/client";
import {
  responseServer200,
  responseServer404,
  responseServer500,
} from "../configs/response.config.js";
import {
  validateUserLogin,
  validateUserRegister,
  validateUserReset,
  validateUserUpdate,
} from "./allValidation.controller.js";
import {
  hash,
  verifHash,
  signAccessJWT,
  signRefreshJWT,
} from "../configs/server.config.js";

/**
 * English: functions that will be used in the endpoint
 * Indonesian: fungsi-fungsi yang akan digunakan di endpoint
 */
const prisma = new PrismaClient();
let response_error = {};

const login = async (req, res) => {
  response_error = {};
  const { error } = validateUserLogin(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { username, password } = req.body;
    try {
      const result = await prisma.users.findUnique({
        where: { username },
      });

      result !== null
        ? (await verifHash(password, result.password))
          ? responseServer200(res, "Successfully login!", {
              username: result.username,
              accessToken: signAccessJWT({
                id_user: result.id_user,
                name: result.name,
                email: result.email,
                role: result.role,
              }),
              refreshToken: signRefreshJWT({
                id_user: result.id_user,
              }),
            })
          : responseServer404(res, "Username or Password is wrong!")
        : responseServer404(res, "Username or Password is wrong!");
    } catch (error) {
      responseServer500(res, "Login user failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const register = async (req, res) => {
  response_error = {};
  const { error } = validateUserRegister(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { name, username, email, password, role } = req.body;
    const passwordHash = hash(password);
    try {
      const result = await prisma.users.create({
        data: {
          name,
          username,
          email,
          password: passwordHash,
          role,
        },
      });
      responseServer200(res, "Successfully register!", {
        name: result.name,
      });
    } catch (error) {
      responseServer500(res, "Create new user failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const reset = async (req, res) => {
  response_error = {};
  const { error } = validateUserReset(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { username, password, email } = req.body;
    try {
      const result = await prisma.users.update({
        where: { username, email },
        data: {
          password: hash(password),
        },
      });

      responseServer200(res, "Successfully reset!", {
        username: result.username,
      });
    } catch (error) {
      responseServer500(res, "Reset user failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const update = async (req, res) => {
  response_error = {};
  const { error } = validateUserUpdate(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { name, username, email, id_user } = req.body;
    try {
      const result = await prisma.users.update({
        where: {
          id_user,
        },
        data: {
          name,
          username,
          email,
        },
      });
      responseServer200(res, "Successfully update!", {
        name: result.name,
      });
    } catch (error) {
      responseServer500(res, "Update user failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const refreshToken = async (req, res) => {
  const id_user = req.id_user;
  try {
    const result = await prisma.users.findUnique({
      where: { id_user: id_user },
    });

    result !== null
      ? responseServer200(res, "Successfully Refresh Token!", {
          accessToken: signAccessJWT({
            id_user: result.id_user,
            name: result.name,
            email: result.email,
            role: result.role,
          }),
          refreshToken: signRefreshJWT({
            id_user: result.id_user,
          }),
        })
      : responseServer404(res, "Can't refresh token, user not found!");
  } catch (error) {
    responseServer500(res, "Refresh token failed!, check error", error);
  }
};

export default { login, register, reset, update, refreshToken };
