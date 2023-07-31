import "./config";
import express, { Express, Request, Response } from "express";
import routes from "./routes/routes";
import dynamoose from "dynamoose";
import cors from "cors";
import addDummyData from "./utils/initDB";
import auth from "./middleware/auth";

const app: Express = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));
auth(app);

if (process.env.NODE_ENV === "development") {
  dynamoose.aws.ddb.local(process.env.DYNAMODB_ENDPOINT);
} else {
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    region: process.env.AWS_REGION,
  });
  dynamoose.aws.ddb.set(ddb);

  dynamoose.Table.defaults.set({
    create: true,
    throughput: "ON_DEMAND",
    prefix: "intern-henryhelm-",
    suffix: "",
    waitForActive: {
      enabled: true,
      check: {
        timeout: 180000,
        frequency: 1000,
      },
    },
    update: false,
    tags: { Name: "intern-henryhelm", Project: "intern-henryhelm" },
    initialize: true,
  });
}

addDummyData();

routes(app);

export default app;
