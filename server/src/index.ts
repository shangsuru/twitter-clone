import express, { Express, Request, Response } from "express";
import routes from "./routes/routes";
import dynamoose from "dynamoose";

const app: Express = express();
const port = 4000;

app.use(express.json());

dynamoose.aws.ddb.local("http://localhost:8000");

routes(app);

app.listen(port, () => {
  console.log(`[Server]: I am running at https://localhost:${port}`);
});
