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
  validateHardwareStore,
  validateHardwareUpdate,
  validateUUIDHardware,
  validateUUIDUser,
} from "./allValidation.controller.js";
import { clientMqtt } from "../configs/server.config.js";

/**
 * English: functions that will be used in the endpoint
 * Indonesian: fungsi-fungsi yang akan digunakan di endpoint
 */
const prisma = new PrismaClient();
let response_error = {};

clientMqtt.on("message", async (topic, message) => {
  if (topic == "CheckESP") {
    const JSONdata = JSON.parse(message.toString());
    try {
      const result = await prisma.hardwares.update({
        where: {
          sn_sensor: JSONdata.sn_sensor,
        },
        data: {
          is_active: JSONdata.is_active,
        },
      });
      console.log("Successfully update active hardware!");
    } catch (error) {
      console.log(`Update active hardware failed!, check error: ${error}`);
    }
  }
});

const index = async (req, res) => {
  try {
    const result = await prisma.hardwares.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    result.length < 1
      ? responseServer404(res, "There is no data hardware in the database yet")
      : responseServer200(res, "Successfully find all hardware!", result);
  } catch (error) {
    responseServer500(res, "Get all data hardware failed!, check error", error);
  }
};

const show = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDHardware(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.hardwares.findFirst({
        where: {
          id_hardware: req.params.id_hardware,
        },
      });
      result === null
        ? responseServer404(
            res,
            "There is no data hardware in the database yet"
          )
        : responseServer200(res, "Successfully find hardware!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data hardware failed!, check error",
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
      const result = await prisma.hardwares.findMany({
        where: {
          id_user: req.params.id_user,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      result.length < 1
        ? responseServer404(
            res,
            "There is no data hardware in the database yet"
          )
        : responseServer200(res, "Successfully find hardware!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data hardware failed!, check error",
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
  const { error } = validateHardwareStore(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { name, sn_sensor, is_active, id_user } = req.body;
    try {
      const result = await prisma.hardwares.create({
        data: {
          name,
          sn_sensor,
          is_active,
          id_user,
        },
      });
      responseServer200(res, "Successfully store hardware!", result);
    } catch (error) {
      responseServer500(res, "Create new hardware failed!, check error", error);
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
  const { error: uuidError } = validateUUIDHardware(req.params);
  if (uuidError)
    uuidError.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });

  const { error: updateError } = validateHardwareUpdate(req.body);
  if (updateError)
    updateError.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });

  if (Object.keys(response_error).length === 0) {
    const { name, is_active } = req.body;
    try {
      const result = await prisma.hardwares.update({
        where: {
          id_hardware: req.params.id_hardware,
        },
        data: {
          name,
          is_active: Boolean(is_active),
        },
      });
      responseServer200(res, "Successfully update hardware!", {
        name: result.name,
        is_active: result.is_active,
      });
    } catch (error) {
      responseServer500(res, "Update hardware failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

const destroy = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDHardware(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      await prisma.hardwares.delete({
        where: {
          id_hardware: req.params.id_hardware,
        },
      });
      responseServer200(res, "Successfully delete hardware!");
    } catch (error) {
      responseServer500(res, "Delete hardware failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

export default { index, show, showByUser, store, update, destroy };
