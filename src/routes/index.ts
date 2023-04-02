import { IRoute } from '../common/interfaces/route.interface';
import { AuthRouter } from '../auth/server/authRouter';

const authRouter = new AuthRouter();

export const routes: IRoute[] = [authRouter];
