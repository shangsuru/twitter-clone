import express, { Express, Request, Response } from "express";
import routes from "./routes/routes";

const app: Express = express();
const port = 4000;

routes(app);

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});
