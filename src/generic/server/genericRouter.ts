import { IRoute } from "../../common/interfaces/route.interface";
import { Router } from "express";
import { hasAccessCookie } from "../../common/middlewares/hasAccessCookie";
import { validateRequest } from "../../common/middlewares/validateRequest";
import {
  createGenericBody,
  genericDelete,
  genericGetByCn,
  genericGetEntries,
  genericPost,
  genericUpdate,
  getGenericBody,
  updateGenericBody,
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
      `${this.path}/:cn`,
      [hasAccessCookie],
      asyncHandler(genericGetByCn)
    );

    this.router.get(
      `${this.path}`,
      [hasAccessCookie, validateRequest(getGenericBody)],
      asyncHandler(genericGetEntries)
    );

    this.router.post(
      `${this.path}`,
      [hasAccessCookie, validateRequest(createGenericBody)],
      asyncHandler(genericPost)
    );

    this.router.delete(
      `${this.path}/:cn`,
      [hasAccessCookie],
      asyncHandler(genericDelete)
    );

    this.router.put(
      `${this.path}/:cn`,
      [hasAccessCookie, validateRequest(updateGenericBody)],
      asyncHandler(genericUpdate)
    );
  }
}
