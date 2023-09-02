import { LoginCommand } from "../domain/login";
import { HttpStatusCode } from "../../common/types/http.model";
import { LoginCommandHandler } from "../domain";
import { Request, Response } from "express";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import Joi from "joi";

export const loginBodySchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const command = new LoginCommand({ username, password });

  try {
    const cookie = await LoginCommandHandler.handle(command);

    res.cookie("credentials", cookie, {
      maxAge: expirationTimeInSecs(10),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.sendStatus(HttpStatusCode.OK);
  } catch (e) {
    if (e instanceof LoginError)
      throw new APIError(HttpStatusCode.UNAUTHORIZED, "Wrong credentials");
    throw e;
  }
};

const expirationTimeInSecs = (sec: number) => sec * 60000;
