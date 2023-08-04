import { Express, Request, Response } from "express";
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
  app.post("/backend/tweets", postTweet);
  app.get("/backend/tweets", getAllTweets);
  app.get("/backend/tweets/:userId", getPersonalTweets);
  app.delete("/backend/tweets/:tweetId", deleteTweet);
  app.patch("/backend/tweets/:tweetId", editTweet);
  app.post("/backend/users/follow", followUser);
  app.delete("/backend/users/unfollow", unfollowUser);
  app.get("/backend/users/:userId/following", getFollowing);
  app.get("/backend/users/:userId/followers", getFollowers);
  app.get("/backend/users/profile/:userId", getUser);
  app.patch("/backend/users/profile", updateUser);
  app.post("/backend/users/profile", createUser);
  app.get("/backend/health", (req: Request, res: Response) => res.send("OK")); // for ALB health checks
}
