import { Request, Response } from "express";
import {
  deleteImage,
  imageKeysToPresignedUrl,
  uploadImage,
} from "../database/images";
import {
  saveTweet,
  getTweets,
  getTweetsOfUser,
  getTweetsById,
  removeTweet,
} from "../database/tweet";
import { getUsersByHandle } from "../database/user";
import { getFollowed } from "../database/follow";
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { AnyItem } from "dynamoose/dist/Item";

async function addUserInfoAndImageUrls(tweets: QueryResponse<AnyItem> | any) {
  const userDataCache = new Map<string, { image: string; username: string }>();
  const tweetsWithUser: object[] = [];
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
  const keysOfSavedImages: string[] = [];
  for (let i = 0; i < images.length; i++) {
    try {
      const key = await uploadImage(images[i]);
      keysOfSavedImages.push(key);
    } catch (err) {
      // On error, clean up all uploaded images so far
      for (const key of keysOfSavedImages) {
        await deleteImage(key);
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
  const tweetsWithUser: any[] = await addUserInfoAndImageUrls(tweets);
  res.send(tweetsWithUser);
}

async function getPersonalTweets(req: Request, res: Response) {
  const { userId } = req.params;
  const followed = await getFollowed(userId);

  // Get the tweets of the users that the user follows
  let tweets: any[] = [];
  for (let i = 0; i < followed.length; i++) {
    const user = followed[i];
    const userTweets = await getTweetsOfUser(user.followed);
    tweets = tweets.concat(userTweets);
  }

  const tweetsWithUser: any[] = await addUserInfoAndImageUrls(tweets);
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
    for (const id of imageIds) {
      await deleteImage(id);
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
