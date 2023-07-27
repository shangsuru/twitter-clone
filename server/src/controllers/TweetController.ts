import { Request, Response } from "express";
import Tweet from "../models/Tweet";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import Follow from "../models/Follow";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { S3ClientConfig } from "@aws-sdk/client-s3";
import imageKeysToPresignedUrl from "../utils/presignedUrl";

const config: S3ClientConfig =
  process.env.NODE_ENV === "production"
    ? {
        region: process.env.AWS_REGION,
        forcePathStyle: true,
      }
    : {
        region: process.env.AWS_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      };

const s3: S3Client = new S3Client(config);

async function postTweet(req: Request, res: Response) {
  const { text, images, handle } = req.body;

  if (!text) {
    res.status(400).send({ message: "Missing text" });
    return;
  }

  // For each image, upload it to S3
  let keysOfSavedImages: string[] = [];
  for (let i = 0; i < images.length; i++) {
    try {
      const image = images[i];
      const key = Date.now().toString() + image.name.replace(",", "");
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: Buffer.from(
            image.body.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
        })
      );
      keysOfSavedImages.push(key);
    } catch (err) {
      // On error, clean up all uploaded images so far
      for (let key of keysOfSavedImages) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
          })
        );
      }
      res.status(500).send({ message: "Error uploading images" });
      return;
    }
  }

  const tweet = new Tweet({
    id: uuid(),
    handle: handle,
    text,
    images: keysOfSavedImages.join(","),
  });

  await tweet.save();
  res.send(tweet);
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

    await imageKeysToPresignedUrl(s3, tweet);

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

  let userDataCache = new Map<string, { image: string; username: string }>();
  let tweetsWithUser: object[] = [];
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];

    await imageKeysToPresignedUrl(s3, tweet);

    // For each tweet, get the username and image of its sender
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

async function deleteTweet(req: Request, res: Response) {
  const { tweetId } = req.params;
  const handle = req.body.handle;

  const tweet = await Tweet.query("id").eq(tweetId).exec();
  if (tweet.length === 0) {
    res.status(404).send({ message: "Tweet not found" });
    return;
  }

  if (tweet[0].handle != handle) {
    res.status(401).send({ message: "Cannot delete tweets of other users" });
    return;
  }

  await Tweet.delete(tweet[0]);
  // Delete images of that tweet from S3
  if (tweet[0].images) {
    const imageIds = tweet[0].images.split(",");
    for (let id of imageIds) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: id,
        })
      );
    }
  }
  res.send({ message: "Tweet deleted" });
}

async function editTweet(req: Request, res: Response) {
  const { tweetId } = req.params;
  const { text, handle } = req.body;

  if (!handle) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

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

export { postTweet, getAllTweets, getPersonalTweets, deleteTweet, editTweet };
