import { config as configDotenv } from "dotenv";
import { resolve } from "path";

switch (process.env.NODE_ENV) {
  case "development":
    configDotenv({ path: resolve(__dirname, "../.env.local") });
    break;
  case "production":
    configDotenv({ path: resolve(__dirname, "../.env.production") });
    break;
  case undefined:
    console.log(
      "NODE_ENV is not set. Please run export NODE_ENV=development to run locally."
    );
    process.exit(1);

  default:
    console.log(
      `NODE_ENV ${process.env.NODE_ENV} is not supported. Please run export NODE_ENV=development to run locally.`
    );
    process.exit(1);
}

const throwIfNot = function <T, K extends keyof T>(
  obj: Partial<T>,
  prop: K,
  msg?: string
): T[K] {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(msg || `Environment is missing variable ${String(prop)}`);
  } else {
    return obj[prop] as T[K];
  }
};

[
  "JWT_SECRET",
  "FRONTEND_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "S3_ENDPOINT",
  "S3_BUCKET_NAME",
  "NODE_ENV",
].forEach((v) => {
  throwIfNot(process.env, v);
});

export interface IProcessEnv {
  JWT_SECRET: string;
  FRONTEND_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  S3_ENDPOINT: string;
  S3_BUCKET_NAME: string;
  NODE_ENV: "development" | "production";
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
