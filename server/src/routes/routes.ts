import { Express } from "express";
import {
  getUser,
  updateUser,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} from "../controllers/UserController";
import {
  getAllTweets,
  getPersonalTweets,
  postTweet,
} from "../controllers/TweetController";

export default function routes(app: Express) {
  app.post("/tweets", postTweet);
  app.get("/tweets", getAllTweets);
  app.get("/tweets/:userId", getPersonalTweets);
  app.post("/users/follow/:userId", followUser);
  app.post("/users/unfollow/:userId", unfollowUser);
  app.get("/users/:userId/following", getFollowing);
  app.get("/users/:userId/followers", getFollowers);
  app.get("/users/profile/:userId", getUser);
  app.patch("/users/profile", updateUser);
}