import express from "express";
import { IRoute } from "./common/interfaces/route.interface";
import { errorHandler, invalidPathHandler } from "./common/errors/RestApiError";
import e from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

dotenv.config();

export class App {
  public app: express.Application;
  private readonly routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.app = express();
    this.routes = routes;
  }

  private initializeRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use("/api/v1/", route.router);
    });

    this.app.use(errorHandler);
    this.app.use(invalidPathHandler);
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(cookieParser());
  }

  async init(): Promise<e.Application> {
    this.app.set("etag", false);

    // We have to initialize the middleware before the routes
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);

    return this.app;
  }

  listen(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.info(`App listening on the port ${port}`);
    });
  }

  logError(error: Error): void {
    console.error(error);
  }
}
