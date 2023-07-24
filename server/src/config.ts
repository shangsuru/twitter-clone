import { config as configDotenv } from "dotenv";
import { resolve } from "path";

switch (process.env.NODE_ENV) {
  case "development":
    configDotenv({ path: resolve(__dirname, "../.env.development") });
    break;
  case "production":
    configDotenv({ path: resolve(__dirname, "../.env.production") });
    break;
  default:
    throw new Error(`NODE_ENV ${process.env.NODE_ENV} is not supported`);
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

["JWT_SECRET"].forEach((v) => {
  throwIfNot(process.env, v);
});

export interface IProcessEnv {
  JWT_SECRET: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
