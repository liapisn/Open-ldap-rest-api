import { IRoute } from "../../common/interfaces/route.interface";
import { Router } from "express";
import { login } from "./authRestApi";
import { asyncHandler } from "../../common/middlewares/asyncHandler";

export class AuthRouter implements IRoute {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, asyncHandler(login));
  }
}
