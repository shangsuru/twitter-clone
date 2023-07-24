import { Request, Response } from "express";
import Tweet from "../models/Tweet";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

function postTweet(req: Request, res: Response) {
  const { text } = req.body;
  if (!text) {
    res.status(400).send({ message: "Missing text" });
    return;
  }

  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      if (!verifiedJwt || typeof verifiedJwt === "string") {
        res.send(401).send({ message: "Unauthorized" });
        return;
      }

      const handle = verifiedJwt.id.split("@")[0];

      const tweet = new Tweet({
        id: uuid(),
        sender: handle,
        text,
      });

      await tweet.save();
      res.send(tweet);
    }
  });
}

function getAllTweets(req: Request, res: Response) {
  res.send("Retrieving the global feed");
}

function getPersonalTweets(req: Request, res: Response) {
  res.send("Retrieving the personal feed " + req.params.userId);
}

export { postTweet, getAllTweets, getPersonalTweets };
