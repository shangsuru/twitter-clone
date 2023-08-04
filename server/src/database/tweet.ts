import Dynamo from "../models/Dynamo";
import { v4 as uuid } from "uuid";
import { AnyItem } from "dynamoose/dist/Item";

async function saveTweet(
  handle: string,
  keysOfSavedImages: string[],
  text: string
) {
  const tweet = new Dynamo({
    type: "TWEET",
    id: uuid(),
    handle: handle,
    text,
    images: keysOfSavedImages.join(","),
    createdAt: Math.floor(Date.now() / 1000),
  });

  await tweet.save();
}

async function getTweets() {
  return await Dynamo.query("type").eq("TWEET").sort("descending").exec();
}

async function getTweetsOfUser(handle: string) {
  return Dynamo.query("type")
    .eq("TWEET")
    .where("handle")
    .eq(handle)
    .sort("descending")
    .exec();
}

async function getTweetsById(id: string) {
  return Dynamo.query("type").eq("TWEET").where("id").eq(id).exec();
}

async function removeTweet(tweet: AnyItem) {
  Dynamo.delete(tweet);
}

async function getTweetsByUser(handle: string) {
  return Dynamo.query("type")
    .eq("TWEET")
    .where("handle")
    .eq(handle)
    .sort("descending")
    .exec();
}

export {
  saveTweet,
  getTweets,
  getTweetsOfUser,
  getTweetsById,
  removeTweet,
  getTweetsByUser,
};
