import { IRoute } from "../../common/interfaces/route.interface";
import { Router } from "express";
import { hasAccessCookie } from "../../common/middlewares/hasAccessCookie";
import { validateRequest } from "../../common/middlewares/validateRequest";
import {
  createGenericBody,
  genericGet,
  genericPost,
  getGenericBody,
} from "./genericRestApi";
import { asyncHandler } from "../../common/middlewares/asyncHandler";

export class GenericRouter implements IRoute {
  public path = "/*";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      [hasAccessCookie, validateRequest(getGenericBody)],
      asyncHandler(genericGet)
    );

    this.router.post(
      `${this.path}`,
      [hasAccessCookie, validateRequest(createGenericBody)],
      asyncHandler(genericPost)
    );
  }
}
