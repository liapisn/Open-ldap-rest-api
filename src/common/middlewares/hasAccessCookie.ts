import CryptoJS from "crypto-js";
import { APIError } from "../errors/RestApiError";
import { HttpStatusCode } from "../types/http.model";
import { Request, Response } from "express";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "e0IcJnxB5kbEA2qYI4U3Gfd+zdRmoabc";

export const hasAccessCookie = async (req: Request, res: Response, next) => {
  if (!req.cookies.credentials)
    return next(new APIError(HttpStatusCode.UNAUTHORIZED, "Unauthorized"));

  try {
    const decryptedCookie = decrypt(req.cookies.credentials);
    req.credentials = JSON.parse(decryptedCookie);
    return next();
  } catch (e) {
    return next(new APIError(HttpStatusCode.UNAUTHORIZED, "Unauthorized"));
  }
};

const decrypt = (cookie): string => {
  const bytes = CryptoJS.AES.decrypt(cookie, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
