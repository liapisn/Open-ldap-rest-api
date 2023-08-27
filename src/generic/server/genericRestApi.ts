import { HttpStatusCode } from "../../common/types/http.model";
import Joi from "joi";
import { Request, Response } from "express";
import {
  GetByFilterCommandHandler,
  GetByCnCommandHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  CopyCommandHandler,
} from "../domain";
import { CreateCommand } from "../domain/create";
import { GetByFilterCommand } from "../domain/get";
import { GetByCnCommand } from "../domain/getByCn";
import { UpdateCommand } from "../domain/update";
import { DeleteCommand } from "../domain/delete";
import { CopyCommand } from "../domain/copy";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { NoSuchAttribute } from "../domain/errors/NoSuchAttribute";
import { NotFound } from "../domain/errors/NotFound";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";
import { AlreadyExists } from "../domain/errors/AlreadyExists";

export const getGenericBody = Joi.object({
  filter: Joi.string().required(),
});

export const genericGetEntries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ous = constructOusForRequest(req);

  const command = new GetByFilterCommand({
    credentials: req.credentials,
    filter: req.body.filter,
    ous,
  });

  let entries;
  try {
    entries = await GetByFilterCommandHandler.handle(command);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
    if (e instanceof NotFound || e instanceof InvalidOrganizationalUnit)
      throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

    throw e;
  }

  return res.status(HttpStatusCode.OK).json({
    data: entries,
  });
};

export const genericGetByCn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ous = constructOusForRequest(req);

  const command = new GetByCnCommand({
    credentials: req.credentials,
    cn: req.params.cn,
    ous,
  });

  let entry;
  try {
    entry = await GetByCnCommandHandler.handle(command);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
    if (e instanceof NotFound || e instanceof InvalidOrganizationalUnit)
      throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

    throw e;
  }

  return res.status(HttpStatusCode.OK).json({
    data: entry,
  });
};

export const createGenericBody = Joi.object({
  entryData: Joi.object({
    cn: Joi.string().required(),
    sn: Joi.string(),
    uid: Joi.string(),
    displayName: Joi.string(),
  }).required(),
});

export const genericPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ous = constructOusForRequest(req);

  const command = new CreateCommand({
    credentials: req.credentials,
    data: req.body.entryData,
    ous: ous,
  });

  try {
    await CreateCommandHandler.handle(command);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
    if (e instanceof AlreadyExists)
      throw new APIError(HttpStatusCode.CONFLICT, e.message);
    if (e instanceof InvalidOrganizationalUnit)
      throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

    throw e;
  }

  return res.sendStatus(HttpStatusCode.OK);
};

export const genericDelete = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ous = constructOusForRequest(req);

  const cn = req.params.cn;

  const command = new DeleteCommand({
    credentials: req.credentials,
    cn,
    ous,
  });

  try {
    await DeleteCommandHandler.handle(command);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
    if (e instanceof NotFound)
      throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

    throw e;
  }

  return res.sendStatus(HttpStatusCode.OK);
};

export const updateGenericBody = Joi.object({
  updatedFields: Joi.object().required(),
});

export const genericUpdate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ous = constructOusForRequest(req);

  const command = new UpdateCommand({
    credentials: req.credentials,
    cn: req.params.cn,
    ous,
    updatedFields: req.body.updatedFields,
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

export const copyBody = Joi.object({
  location: Joi.string().required(),
  dn: Joi.string().required(),
});

export const copy = async (req: Request, res: Response): Promise<Response> => {
  const command = new CopyCommand({
    credentials: req.credentials,
    location: req.body.location,
    dn: req.body.dn,
  });

  try {
    await CopyCommandHandler.handle(command);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
    if (e instanceof NoSuchAttribute)
      throw new APIError(HttpStatusCode.NOT_FOUND, e.message);
    if (e instanceof AlreadyExists)
      throw new APIError(HttpStatusCode.CONFLICT, e.message);

    throw e;
  }
  return res.sendStatus(HttpStatusCode.OK);
};

const constructOusForRequest = (req: Request) =>
  req.path
    .split("/")
    .filter(
      (ou) =>
        ou !== "" && ou.replace(/%20/g, " ") !== req.params.cn && ou !== "cns"
    );
