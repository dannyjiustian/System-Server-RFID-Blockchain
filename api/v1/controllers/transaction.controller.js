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
  validateTransactionStore,
  validateUUIDTransaction,
} from "./allValidation.controller.js";
import { clientMqtt } from "../configs/server.config.js";

/**
 * English: functions that will be used in the endpoint
 * Indonesian: fungsi-fungsi yang akan digunakan di endpoint
 */
const prisma = new PrismaClient();
let response_error = {};

clientMqtt.on("message", async (topic, message) => {
  if (topic == "ReadRFID") {
    const JSONdata = JSON.parse(message.toString());
    try {
      const result = await prisma.transactions.findFirst({
        where: {
          hardwares: {
            sn_sensor: JSONdata.sn_sensor,
          },
          txn_hash: null,
        },
      });
      console.log(result);
      console.log("Successfully update transaction!");
    } catch (error) {
      console.log(`Update transaction failed!, check error: ${error}`);
    }
  }
});

const index = async (req, res) => {
  try {
    const result = await prisma.transactions.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    result.length < 1
      ? responseServer404(
          res,
          "There is no data transaction in the database yet"
        )
      : responseServer200(res, "Successfully find all transaction!", result);
  } catch (error) {
    responseServer500(
      res,
      "Get all data transaction failed!, check error",
      error
    );
  }
};

const show = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDTransaction(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.transactions.findFirst({
        where: {
          id_transaction: req.params.id_transaction,
        },
      });
      result === null
        ? responseServer404(
            res,
            "There is no data transaction in the database yet"
          )
        : responseServer200(res, "Successfully find transaction!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data transaction failed!, check error",
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
  const { error } = validateTransactionStore(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const {
      total_payment,
      txn_hash,
      id_user,
      id_hardware,
      id_card,
      id_outlet,
    } = req.body;
    try {
      const result = await prisma.transactions.create({
        data: {
          total_payment,
          txn_hash,
          id_user,
          id_hardware,
          id_card,
          id_outlet,
        },
      });
      responseServer200(res, "Successfully store transaction!", result);
    } catch (error) {
      console.log(error);
      responseServer500(
        res,
        "Create new transaction failed!, check error",
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

export default { index, show, store };
