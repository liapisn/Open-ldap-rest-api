import { HttpStatusCode } from "../types/http.model";
import { NextFunction, Request, Response } from "express";

export const invalidPathHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.status(HttpStatusCode.NOT_FOUND).send({ message: 'Invalid path' });
};
