import express from "express";
import { IRoute } from "./interfaces/route.interface";
import { invalidPathHandler } from "./errors/RestApiError";
import e from "express";
import dotenv from "dotenv";

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
      this.app.use('/api/v1/', route.router);
    });

    this.app.use(invalidPathHandler);
  }

  async init(): Promise<e.Application> {
    this.app.set('etag', false);

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
