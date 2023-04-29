import { HttpStatusCode } from "../../common/types/http.model";
import Joi from "joi";
import { Response } from "express";
import { GetCommandHandler, CreateCommandHandler } from "../domain";
import { GetCommand } from "../domain/get";
import { CreateCommand } from "../domain/create";

export const getGenericBody = Joi.object({
  filter: Joi.string().required(),
});

export const genericGet = async (req, res): Promise<Response> => {
  const ous = req.path.split("/").filter((ou) => ou !== "");

  const command = new GetCommand({
    credentials: req.credentials,
    filter: req.body.filter,
    ous,
    multiple: req.query.multiple?.toLowerCase() === "true",
  });
  const entries = await GetCommandHandler.handle(command);

  return res.status(HttpStatusCode.OK).json({
    data: entries,
  });
};

export const createGenericBody = Joi.object({
  entryData: Joi.object({
    cn: Joi.string().required(),
    sn: Joi.string(),
    uid: Joi.string(),
  }).required(),
});

export const genericPost = async (req, res): Promise<Response> => {
  const ous = req.path.split("/").filter((ou) => ou !== "");

  const command = new CreateCommand({
    credentials: req.credentials,
    data: req.body.entryData,
    ous: ous,
  });
  await CreateCommandHandler.handle(command);

  return res.sendStatus(HttpStatusCode.OK);
};
