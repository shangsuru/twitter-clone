import "./config";
import express, { Express, Request, Response } from "express";
import routes from "./routes/routes";
import dynamoose from "dynamoose";
import cors from "cors";
import addDummyData from "./utils/initDB";

const app: Express = express();
const port = 4000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));

if (process.env.NODE_ENV === "development") {
  dynamoose.aws.ddb.local("http://localhost:8000");
} else {
  throw Error("DynamoDB not setup for production");
}

addDummyData();

routes(app);

app.listen(port, () => {
  console.log(
    `[Server]: I am running at http://localhost:${port} in ${process.env.NODE_ENV} mode`
  );
});
