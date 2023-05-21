import { HttpStatusCode } from "../../common/types/http.model";
import Joi from "joi";
import { Response } from "express";
import {
  GetCommandHandler,
  CreateCommandHandler,
  DeleteCommandHandler,
  UpdateCommandHandler,
} from "../domain";
import { GetCommand } from "../domain/get";
import { CreateCommand } from "../domain/create";
import { DeleteCommand } from "../domain/delete";
import { UpdateCommand } from "../domain/update";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { NoSuchAttribute } from "../domain/errors/NoSuchAttribute";

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

export const deleteGenericBody = Joi.object({
  cn: Joi.string().required(),
});

export const genericDelete = async (req, res): Promise<Response> => {
  const ous = req.path.split("/").filter((ou) => ou !== "");
  const cn = req.body.cn;

  const command = new DeleteCommand({
    credentials: req.credentials,
    cn,
    ous,
  });
  await DeleteCommandHandler.handle(command);

  return res.sendStatus(HttpStatusCode.OK);
};

export const updateGenericBody = Joi.object({
  updatedField: Joi.object().required(),
});

export const genericUpdate = async (req, res): Promise<Response> => {
  const command = new UpdateCommand({
    credentials: req.credentials,
    dn: req.params.dn,
    updatedField: req.body.updatedField,
  });
  try {
    await UpdateCommandHandler.handle(command);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
    if (e instanceof NoSuchAttribute)
      throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

    throw e;
  }
  return res.sendStatus(HttpStatusCode.OK);
};
