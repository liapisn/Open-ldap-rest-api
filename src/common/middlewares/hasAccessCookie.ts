import { APIError } from "../errors/RestApiError";
import { HttpStatusCode } from "../types/http.model";
import { Request, Response } from "express";

export const hasAccessCookie = async (req: Request, res: Response, next) => {
  if (!req.cookies.credentials)
    return next(new APIError(HttpStatusCode.UNAUTHORIZED, "Unauthorized"));

  req.credentials = JSON.parse(req.cookies.credentials); //TODO will decode the credentials here
  return next();
};
