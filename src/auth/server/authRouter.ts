import { IRoute } from "../../common/interfaces/route.interface";
import { Router } from "express";
import { login, loginBodySchema } from "./authRestApi";
import { asyncHandler } from "../../common/middlewares/asyncHandler";
import { validateRequest } from "../../common/middlewares/validateRequest";

export class AuthRouter implements IRoute {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      [validateRequest(loginBodySchema)],
      asyncHandler(login)
    );
  }
}
