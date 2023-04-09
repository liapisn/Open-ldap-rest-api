import { Response } from "express";
import { GetUserCommand } from "../domain/getUser";
import { CreateUserCommandHandler, GetUserCommandHandler } from "../domain";
import Joi from "joi";
import { CreateUserCommand } from "../domain/createUser";
import { HttpStatusCode } from "../../common/types/http.model";

export const getUserBody = Joi.object({
  filter: Joi.string().required(),
});

export const getUser = async (req, res): Promise<Response> => {
  const command = new GetUserCommand({
    credentials: req.credentials,
    filter: req.body.filter,
  });
  const user = await GetUserCommandHandler.handle(command);

  return res.status(HttpStatusCode.OK).json({
    data: user,
  });
};

export const createUserBody = Joi.object({
  userData: Joi.object({
    cn: Joi.string().required(),
    sn: Joi.string(),
    uid: Joi.string(),
  }).required(),
});

export const createUser = async (req, res): Promise<Response> => {
  const command = new CreateUserCommand({
    credentials: req.credentials,
    data: req.body.userData,
  });
  await CreateUserCommandHandler.handle(command);

  return res.sendStatus(HttpStatusCode.OK);
};
