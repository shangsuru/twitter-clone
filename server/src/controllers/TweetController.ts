import { Request, Response } from "express";
import Tweet from "../models/Tweet";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import Follow from "../models/Follow";

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
        handle: handle,
        text,
      });

      await tweet.save();
      res.send(tweet);
    }
  });
}

async function getAllTweets(req: Request, res: Response) {
  const tweets = await Tweet.scan().exec();

  tweets.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  // For each tweet, get the username and image of its sender
  let userDataCache = new Map<string, { image: string; username: string }>();
  let tweetsWithUser: object[] = [];
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    if (userDataCache.has(tweet.handle) && userDataCache.get(tweet.handle)) {
      const user = userDataCache.get(tweet.handle);
      tweetsWithUser.push({
        ...tweet,
        image: user!.image,
        sender: user!.username,
      });
      continue;
    }

    const users = await User.query("handle").eq(tweet.handle).exec();
    if (users.length === 0) {
      continue;
    }

    const user = users[0];
    userDataCache.set(tweet.handle, {
      image: user.image,
      username: user.username,
    });
    tweetsWithUser.push({
      ...tweet,
      image: user.image,
      sender: user.username,
    });
  }

  res.send(tweetsWithUser);
}

async function getPersonalTweets(req: Request, res: Response) {
  // Get the handle from the request
  const { userId } = req.params;

  // Find all users that this user follows
  let followed = await Follow.query("follower").eq(userId).exec();

  // Get the tweets of the users that the user follows
  let tweets: any[] = [];
  for (let i = 0; i < followed.length; i++) {
    const user = followed[i];
    const userTweets = await Tweet.query("handle").eq(user.followed).exec();
    tweets = tweets.concat(userTweets);
  }

  tweets.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  // For each tweet, get the username and image of its sender
  let userDataCache = new Map<string, { image: string; username: string }>();
  let tweetsWithUser: object[] = [];
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    if (userDataCache.has(tweet.handle) && userDataCache.get(tweet.handle)) {
      const user = userDataCache.get(tweet.handle);
      tweetsWithUser.push({
        ...tweet,
        image: user!.image,
        sender: user!.username,
      });
      continue;
    }

    const users = await User.query("handle").eq(tweet.handle).exec();
    if (users.length === 0) {
      continue;
    }

    const user = users[0];
    userDataCache.set(tweet.handle, {
      image: user.image,
      username: user.username,
    });
    tweetsWithUser.push({
      ...tweet,
      image: user.image,
      sender: user.username,
    });
  }

  res.send(tweetsWithUser);
}

function deleteTweet(req: Request, res: Response) {
  const { tweetId } = req.params;

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

      const tweet = await Tweet.query("id").eq(tweetId).exec();
      if (tweet.length === 0) {
        res.status(404).send({ message: "Tweet not found" });
        return;
      }

      if (tweet[0].handle != handle) {
        res
          .status(401)
          .send({ message: "Cannot delete tweets of other users" });
        return;
      }

      await Tweet.delete(tweet[0]);
      res.send({ message: "Tweet deleted" });
    }
  });
}

function editTweet(req: Request, res: Response) {
  const { tweetId } = req.params;
  const { text } = req.body;

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

      const tweet = await Tweet.query("id").eq(tweetId).exec();
      if (tweet.length === 0) {
        res.status(404).send({ message: "Tweet not found" });
        return;
      }

      if (tweet[0].handle != handle) {
        res.status(401).send({ message: "Cannot edit tweets of other users" });
        return;
      }

      tweet[0].text = text;
      await tweet[0].save();
      res.send(tweet[0]);
    }
  });
}

export { postTweet, getAllTweets, getPersonalTweets, deleteTweet, editTweet };
