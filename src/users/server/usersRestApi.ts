import { Response } from "express";
import { GetUserCommand } from "../domain/getUser";
import { GetUserCommandHandler } from "../domain";
import Joi from "joi";
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
