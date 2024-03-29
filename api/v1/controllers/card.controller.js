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
  validateCardRfid,
  validateCardStore,
  validateCardUpdate,
  validateUUIDCard,
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
    const result = await prisma.cards.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    result.length < 1
      ? responseServer404(res, "There is no data card in the database yet")
      : responseServer200(res, "Successfully find all card!", result);
  } catch (error) {
    responseServer500(res, "Get all data card failed!, check error", error);
  }
};

const show = async (req, res) => {
  response_error = {};
  const { error } = validateUUIDCard(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.cards.findFirst({
        where: {
          id_card: req.params.id_card,
        },
      });
      result === null
        ? responseServer404(res, "There is no data card in the database yet")
        : responseServer200(res, "Successfully find card!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data card failed!, check error",
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

const searchCard = async (req, res) => {
  response_error = {};
  const { error } = validateCardRfid(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.cards.findFirst({
        where: {
          id_rfid: req.params.id_rfid,
        },
      });
      result === null
        ? responseServer200(res, "The Card not register anyware!")
        : responseServer404(
            res,
            "The card already register to another account"
          );
    } catch (error) {
      responseServer500(
        res,
        "Get specific data card failed!, check error",
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
          id_user: req.params.id_user,
        },
        orderBy: {
          balance: "desc",
        },
      };
      if (typeof req.query.id_rfid !== "undefined" && req.query.id_rfid !== "")
        options.where.id_rfid = req.query.id_rfid;
      const result = await prisma.cards.findMany(options);
      result.length < 1
        ? responseServer404(res, "There is no data card in the database yet")
        : responseServer200(res, "Successfully find card!", result);
    } catch (error) {
      responseServer500(
        res,
        "Get specific data card failed!, check error",
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
  const { error } = validateCardStore(req.body);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    const { id_rfid, balance, id_user } = req.body;
    try {
      const result = await prisma.cards.create({
        data: {
          id_rfid,
          balance: parseFloat(balance),
          wallet_address: "0xsdasdasdasdasdasdasdasda",
          id_user,
        },
      });
      responseServer200(res, "Successfully store card!", result);
    } catch (error) {
      console.log(error);
      responseServer500(res, "Create new card failed!, check error", error);
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
  const { error: uuidError } = validateUUIDCard(req.params);
  if (uuidError)
    uuidError.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });

  const { error: updateError } = validateCardUpdate(req.body);
  if (updateError)
    updateError.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });

  if (Object.keys(response_error).length === 0) {
    try {
      const result = await prisma.cards.update({
        where: {
          id_card: req.params.id_card,
        },
        data: {
          balance: {
            increment: parseFloat(req.body.balance),
          },
        },
      });
      responseServer200(res, "Successfully update card!", {
        balance: result.balance,
      });
    } catch (error) {
      console.log(error);
      responseServer500(res, "Update card failed!, check error", error);
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
  const { error } = validateUUIDCard(req.params);
  if (error)
    error.details.forEach((err_msg) => {
      response_error[err_msg.path[0]] = err_msg.message;
    });
  if (Object.keys(response_error).length === 0) {
    try {
      await prisma.cards.delete({
        where: {
          id_card: req.params.id_card,
        },
      });
      responseServer200(res, "Successfully delete card!");
    } catch (error) {
      responseServer500(res, "Delete card failed!, check error", error);
    }
  } else {
    responseServer500(
      res,
      "Your request cannot run due to an error, check",
      JSON.parse(JSON.stringify(response_error).replace(/\\"/g, ""))
    );
  }
};

export default { index, show, searchCard, showByUser, store, update, destroy };
