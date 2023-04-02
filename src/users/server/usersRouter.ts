import { IRoute } from "../../common/interfaces/route.interface";
import { Router } from "express";
import { asyncHandler } from "../../common/middlewares/asyncHandler";
import { getUser, getUserBody } from "./usersRestApi";
import { hasAccessCookie } from "../../common/middlewares/hasAccessCookie";
import { validateRequest } from "../../common/middlewares/validateRequest";

export class UsersRouter implements IRoute {
  public path = "/users";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      [hasAccessCookie, validateRequest(getUserBody)],
      asyncHandler(getUser)
    );
  }
}
