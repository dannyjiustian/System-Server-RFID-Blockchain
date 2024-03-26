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
  const JSONdata = JSON.parse(message.toString());
  if (topic == "ReadRFID") {
    try {
      const resultTransaction = await prisma.transactions.findFirstOrThrow({
        where: {
          type: JSONdata.type,
          txn_hash: null,
          status: "On Proses",
        },
      });

      const resultHardware = await prisma.hardwares.findFirst({
        where: {
          id_user: resultTransaction.id_user,
          sn_sensor: JSONdata.sn_sensor,
          is_active: true,
        },
      });

      if (resultHardware == null) {
        clientMqtt.publish(
          resultTransaction.id_transaction,
          JSON.stringify({
            status: false,
            message: "Hardware Not Found",
            code: 404,
          })
        );
        return;
      }

      const resultCard = await prisma.cards.findFirst({
        where: {
          id_rfid: JSONdata.rfid,
        },
      });

      if (resultCard == null) {
        clientMqtt.publish(
          resultTransaction.id_transaction,
          JSON.stringify({
            status: false,
            message: "Card Not Found",
            code: 404,
          })
        );
        return;
      }

      if (JSONdata.type === 0) {
        // before this will later check the etherium blockchain transaction
        const balance_update =
          resultCard.balance - resultTransaction.total_payment;
        if (balance_update < 1) {
          clientMqtt.publish(
            resultTransaction.id_transaction,
            JSON.stringify({
              status: false,
              message: "Balance Card Not Enough",
              code: 403,
            })
          );
        } else {
          await prisma.$transaction([
            prisma.transactions.update({
              where: {
                id_transaction: resultTransaction.id_transaction,
              },
              data: {
                id_hardware: resultHardware.id_hardware,
                id_card: resultCard.id_card,
                id_user: resultCard.id_user,
                status: "Selesai",
                txn_hash: "helo",
              },
            }),
            prisma.cards.update({
              where: {
                id_card: resultCard.id_card,
              },
              data: {
                balance: balance_update,
              },
            }),
            prisma.outlets.update({
              where: {
                id_outlet: resultTransaction.id_outlet,
              },
              data: {
                balance: {
                  increment: resultTransaction.total_payment,
                },
              },
            }),
          ]);
          clientMqtt.publish(
            resultTransaction.id_transaction,
            JSON.stringify({
              status: true,
              message: "Transaction Successfully",
              code: 200,
            })
          );
        }
      }
      //else if (JSONdata.type === 1) {
      //   await prisma.cards.update({
      //     where: {
      //       id_rfid: result.cards.id_rfid,
      //     },
      //     data: {
      //       balance: {
      //         increment: result.total_payment,
      //       },
      //     },
      //   });
      //   clientMqtt.publish(
      //     result.id_transaction,
      //     JSON.stringify({
      //       success: true,
      //       message: "Transaction Successfully",
      //       code: 200,
      //     })
      //   );
      // }
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
      let options = {
        where: {
          id_transaction: req.params.id_transaction,
        },
      };
      if (typeof req.query.status !== "undefined" && req.query.status !== "") {
        options.where.status = {};
        req.query.status === "true"
          ? (options.where.status.not = "On Proses")
          : (options.where.status = "On Proses");
      }
      const result = await prisma.transactions.findFirst(options);
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

const showByUser = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDUser(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      let options = {
        where: {
          OR: [
            {
              id_user: req.params.id_user,
            },
          ],
        },
        orderBy: {
          created_at: "desc",
        },
      };
      if (typeof req.query.take !== "undefined" && req.query.take !== "")
        options.take = parseInt(req.query.take);
      if (typeof req.query.status !== "undefined" && req.query.status !== "") {
        options.where.status = {};
        req.query.status === "true"
          ? (options.where.status.not = "On Proses")
          : (options.where.status = "On Proses");
      }
      if (
        typeof req.query.id_outlet !== "undefined" &&
        req.query.id_outlet !== ""
      )
        options.where.OR.push({
          id_outlet: req.query.id_outlet,
        });
      const result = await prisma.transactions.findMany(options);
      result.length < 1
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
      type,
      total_payment,
      txn_hash,
      id_user,
      id_hardware,
      id_card,
      id_outlet,
      status,
    } = req.body;
    try {
      if (typeof status === "undefined") {
        const resultCheck = await prisma.transactions.findFirst({
          where: {
            id_user,
            type: parseInt(type),
            status: "On Proses",
          },
        });

        if (resultCheck !== null) {
          await prisma.transactions.delete({
            where: {
              id_transaction: resultCheck.id_transaction,
            },
          });
        }
      }

      const result = await prisma.transactions.create({
        data: {
          type: parseInt(type),
          total_payment: parseInt(total_payment),
          txn_hash,
          id_user,
          id_hardware,
          id_card,
          id_outlet,
          status: typeof status == "undefined" ? "On Proses" : status,
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

const cancel = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDTransaction(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.transactions.update({
        where: {
          id_transaction: req.params.id_transaction,
          status: "On Proses",
        },
        data: {
          status: "Batal",
        },
      });
      responseServer200(res, "Successfully cancel transaction!", result);
    } catch (error) {
      responseServer500(res, "Cancel transaction failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

export default { index, show, showByUser, store, cancel };
