import { IRoute } from "../common/interfaces/route.interface";
import { AuthRouter } from "../auth/server/authRouter";
import { UsersRouter } from "../users/server/usersRouter";

const authRouter = new AuthRouter();
const usersRouter = new UsersRouter();

export const routes: IRoute[] = [authRouter, usersRouter];
