import { Express, NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

async function jwtVerify(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      if (!decoded || typeof decoded === "string") {
        return reject(new Error("Invalid JWT"));
      }
      resolve(decoded);
    });
  });
}

function needsAuthentication(req: Request): boolean {
  if (
    (req.path === "/backend/users/profile" && req.method === "PATCH") ||
    (req.path === "/backend/tweets" && req.method === "POST") ||
    (req.path.startsWith("/backend/tweets/") && req.method === "DELETE") ||
    (req.path.startsWith("/backend/tweets/") && req.method === "PATCH") ||
    (req.path === "/backend/users/follow" && req.method === "POST") ||
    (req.path === "/backend/users/unfollow" && req.method === "DELETE") ||
    (req.path.startsWith("/backend/users/profile/") &&
      req.method === "GET" &&
      !req.path.startsWith("/backend/users/profile/follow"))
  ) {
    return true;
  }
  return false;
}

export default function routes(app: Express) {
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (needsAuthentication(req)) {
      const authorization = req.headers.authorization;
      if (authorization) {
        const token = authorization.split(" ")[1];

        try {
          const decoded = await jwtVerify(token);
          const handle = decoded.id.split("@")[0];
          req.body.handle = handle; // authenticated
          next();
          return;
        } catch (err) {
          res.status(401).send({ message: "Unauthorized" });
          return;
        }
      }
    } else {
      next();
    }
  });
}
