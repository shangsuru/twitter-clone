import { Request, Response } from "express";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { imageKeysToPresignedUrl, s3 } from "../utils/s3";
import {
  saveTweet,
  getTweets,
  getTweetsOfUser,
  getTweetsById,
  removeTweet,
} from "../database/tweet";
import { getUsersByHandle } from "../database/user";
import { getFollowed } from "../database/follow";

async function addUserInfoAndImageUrls(tweets: any[]) {
  let userDataCache = new Map<string, { image: string; username: string }>();
  let tweetsWithUser: object[] = [];
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];

    await imageKeysToPresignedUrl(tweet);

    if (userDataCache.has(tweet.handle) && userDataCache.get(tweet.handle)) {
      const user = userDataCache.get(tweet.handle);
      tweetsWithUser.push({
        ...tweet,
        image: user!.image,
        sender: user!.username,
      });
      continue;
    }

    const users = await getUsersByHandle(tweet.handle);
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
  return tweetsWithUser;
}

async function postTweet(req: Request, res: Response) {
  const { text, images, handle } = req.body;

  if (!text) {
    res.status(400).send({ message: "Missing text" });
    return;
  }

  if (text.length > 200) {
    res.status(400).send({ message: "Text too long" });
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

  const tweet = saveTweet(handle, keysOfSavedImages, text);
  res.send(tweet);
}

async function getAllTweets(req: Request, res: Response) {
  const tweets = await getTweets();

  let tweetsWithUser: any[] = await addUserInfoAndImageUrls(tweets);

  res.send(tweetsWithUser);
}

async function getPersonalTweets(req: Request, res: Response) {
  const { userId } = req.params;
  let followed = await getFollowed(userId);

  // Get the tweets of the users that the user follows
  let tweets: any[] = [];
  for (let i = 0; i < followed.length; i++) {
    const user = followed[i];
    const userTweets = await getTweetsOfUser(user.followed);
    tweets = tweets.concat(userTweets);
  }

  let tweetsWithUser: any[] = await addUserInfoAndImageUrls(tweets);
  res.send(tweetsWithUser);
}

async function deleteTweet(req: Request, res: Response) {
  const { tweetId } = req.params;
  const handle = req.body.handle;

  const tweet = await getTweetsById(tweetId);
  if (tweet.length === 0) {
    res.status(404).send({ message: "Tweet not found" });
    return;
  }

  if (tweet[0].handle != handle) {
    res.status(401).send({ message: "Cannot delete tweets of other users" });
    return;
  }

  await removeTweet(tweet[0]);
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

  if (text.length > 200) {
    res.status(400).send({ message: "Text too long" });
  }

  const tweet = await getTweetsById(tweetId);
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
