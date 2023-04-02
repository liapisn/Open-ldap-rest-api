import { HttpStatusCode } from "../types/http.model";
import { NextFunction, Request, Response } from "express";

export const invalidPathHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(HttpStatusCode.NOT_FOUND).send({ message: "Invalid path" });
};

export class APIError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.header("Content-Type", "application/json");

  let status;
  let message;

  if (error instanceof APIError) {
    status = error.statusCode || HttpStatusCode.BAD_REQUEST;
    message = error.message;
  } else {
    status = HttpStatusCode.INTERNAL_SERVER;
    message = "Internal Server Error";
    console.error(
      { error, request },
      `Server Error in api ${request.path}: %s`,
      error.message
    );
  }

  console.warn(
    {
      url: request.originalUrl, // add url to response as well for simple correlating
      method: request.method,
      status_code: status,
      request_body: request.body,
      message,
    },
    `Request ${request.method} ${request.originalUrl} failed with status_code:${status}`
  );

  response.status(status).send({ message: message });
};
