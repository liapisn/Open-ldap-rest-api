import { APIError } from "../errors/RestApiError";
import { HttpStatusCode } from "../types/http.model";
import Joi from "joi";
import { RequestHandler } from "express";
import { Request, Response } from "express";

export const validateRequest = (schema: Joi.Schema): RequestHandler => {
  return (req: Request, res: Response, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        `${error.message} on body`
      );
    }
    next();
  };
};
