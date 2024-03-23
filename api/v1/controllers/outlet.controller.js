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
  validateOutletStore,
  validateOutletUpdate,
  validateUUIDOutlet,
  validateUUIDUser,
} from "./allValidation.controller.js";

/**
 * English: functions that will be used in the endpoint
 * Indonesian: fungsi-fungsi yang akan digunakan di endpoint
 */
const prisma = new PrismaClient();
let response_error = {};

const index = async (req, res) => {
  try {
    const result = await prisma.outlets.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    result.length < 1
      ? responseServer404(res, "There is no data outlet in the database yet")
      : responseServer200(res, "Successfully find all outlet!", result);
  } catch (error) {
    responseServer500(res, "Get all data outlet failed!, check error", error);
  }
};

const show = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDOutlet(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.outlets.findFirst({
        where: {
          id_outlet: req.params.id_outlet,
        },
      });
      result === null
        ? responseServer404(res, "There is no data outlet in the database yet")
        : responseServer200(res, "Successfully find outlet!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data outlet failed!, check error",
        error
      );
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const showByUser = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDUser(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.outlets.findFirst({
        where: {
          id_user: req.params.id_user,
        },
      });
      result === null
        ? responseServer404(res, "There is no data outlet in the database yet")
        : responseServer200(res, "Successfully find outlet!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data outlet failed!, check error",
        error
      );
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const store = async (req, res) => {
  response_error = {};
  const { error } = validateOutletStore(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { balance, smart_contract, id_user } = req.body;
    try {
      const result = await prisma.outlets.create({
        data: {
          balance,
          smart_contract,
          id_user,
        },
      });
      responseServer200(res, "Successfully store outlet!", result);
    } catch (error) {
      console.log(error);
      responseServer500(res, "Create new outlet failed!, check error", error);
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
  const { error: uuidError } = validateUUIDOutlet(req.params);
  if (uuidError)
    uuidError.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });

  const { error: updateError } = validateOutletUpdate(req.body);
  if (updateError)
    updateError.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });

  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.outlets.update({
        where: {
          id_outlet: req.params.id_outlet,
        },
        data: {
          balance: parseFloat(req.body.balance),
        },
      });
      responseServer200(res, "Successfully update outlet!", {
        balance: result.balance,
      });
    } catch (error) {
      responseServer500(res, "Update outlet failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

export default { index, show, showByUser, store, update };
