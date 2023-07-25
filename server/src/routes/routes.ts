import { Express } from "express";
import {
  getUser,
  updateUser,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  createUser,
} from "../controllers/UserController";
import {
  getAllTweets,
  getPersonalTweets,
  postTweet,
  deleteTweet,
  editTweet,
} from "../controllers/TweetController";

export default function routes(app: Express) {
  app.post("/tweets", postTweet);
  app.get("/tweets", getAllTweets);
  app.get("/tweets/:userId", getPersonalTweets);
  app.delete("/tweets/:tweetId", deleteTweet);
  app.patch("/tweets/:tweetId", editTweet);
  app.post("/users/follow", followUser);
  app.delete("/users/unfollow", unfollowUser);
  app.get("/users/:userId/following", getFollowing);
  app.get("/users/:userId/followers", getFollowers);
  app.get("/users/profile/:userId", getUser);
  app.patch("/users/profile", updateUser);
  app.post("/users/profile", createUser);
}
