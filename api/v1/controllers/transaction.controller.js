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
  const JSONdata = JSON.parse(message.toString());
  if (topic == "ReadRFID") {
    try {
      const result = await prisma.transactions.findFirstOrThrow({
        where: {
          type: JSONdata.type,
          hardwares: {
            sn_sensor: JSONdata.sn_sensor,
          },
          cards: {
            id_rfid: JSONdata.rfid,
          },
          txn_hash: null,
        },
        include: {
          cards: true,
          outlets: true,
        },
      });

      if (JSONdata.type === 0) {
        // before this will later check the etherium blockchain transaction
        const balance_update = result.cards.balance - result.total_payment;
        if (balance_update < 0) {
          clientMqtt.publish(
            result.id_transaction,
            JSON.stringify({
              success: false,
              message: "Balance Card Not Enough",
              code: 400,
            })
          );
        } else {
          await prisma.transactions.update({
            where: {
              id_transaction: result.id_transaction,
            },
            data: {
              txn_hash: "helo",
            },
          });
          await prisma.cards.update({
            where: {
              id_rfid: result.cards.id_rfid,
            },
            data: {
              balance: balance_update,
            },
          });
          await prisma.outlets.update({
            where: {
              id_outlet: result.outlets.id_outlet,
            },
            data: {
              balance: {
                increment: result.total_payment,
              },
            },
          });
          clientMqtt.publish(
            result.id_transaction,
            JSON.stringify({
              success: true,
              message: "Transaction Successfully",
              code: 200,
            })
          );
        }
      } else if (JSONdata.type === 1) {
        await prisma.cards.update({
          where: {
            id_rfid: result.cards.id_rfid,
          },
          data: {
            balance: {
              increment: result.total_payment,
            },
          },
        });
        clientMqtt.publish(
          result.id_transaction,
          JSON.stringify({
            success: true,
            message: "Transaction Successfully",
            code: 200,
          })
        );
      }
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
      type,
      total_payment,
      txn_hash,
      id_user,
      id_hardware,
      id_card,
      id_outlet,
    } = req.body;
    try {
      const resultCheck = await prisma.transactions.findFirst({
        where: {
          type: type,
          txn_hash: null,
        },
      });

      if (resultCheck !== null) {
        await prisma.transactions.delete({
          where: {
            id_transaction: resultCheck.id_transaction,
          },
        });
      }
      const result = await prisma.transactions.create({
        data: {
          type,
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
