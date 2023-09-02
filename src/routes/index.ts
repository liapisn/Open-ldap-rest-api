import { IRoute } from "../common/interfaces/route.interface";
import { AuthRouter } from "../auth/server/authRouter";
import { GenericRouter } from "../generic/server/genericRouter";

const authRouter = new AuthRouter();
const genericRouter = new GenericRouter();

export const routes: IRoute[] = [authRouter, genericRouter];
