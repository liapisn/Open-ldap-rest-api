import { LoginCommand } from "../domain/login";
import { HttpStatusCode } from "../../common/types/http.model";
import { LoginCommandHandler } from "../domain";
import { Request, Response } from "express";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const command = new LoginCommand({ username, password });

  try {
    const cookie = await LoginCommandHandler.handle(command);

    res.cookie("credentials", cookie, {
      maxAge: 600000,
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
