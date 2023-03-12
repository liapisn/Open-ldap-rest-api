import { App } from './app';
import { routes } from './routes';

const app = new App(routes);

app
  .init()
  .then(() => {
    app.listen();
  })
  .catch((error) => {
    app.logError(error);
    process.exit(1);
  });
