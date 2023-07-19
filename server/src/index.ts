import express, { Express, Request, Response } from "express";
import routes from "./routes/routes";
import dynamoose from "dynamoose";
import cors from "cors";
import dotenv from "dotenv";
import addDummyData from "./utils/initDB";

const app: Express = express();
const port = 4000;

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

dynamoose.aws.ddb.local("http://localhost:8000");

addDummyData();

routes(app);

app.listen(port, () => {
  console.log(`[Server]: I am running at https://localhost:${port}`);
});
