import { IRoute } from "../common/interfaces/route.interface";
import { AuthRouter } from "../auth/server/authRouter";
import { UsersRouter } from "../users/server/usersRouter";
import { GenericRouter } from "../generic/server/genericRouter";

const authRouter = new AuthRouter();
const usersRouter = new UsersRouter();
const genericRouter = new GenericRouter();

export const routes: IRoute[] = [authRouter, genericRouter];
