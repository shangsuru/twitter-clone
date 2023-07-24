import { Request, Response } from "express";

function postTweet(req: Request, res: Response) {
  res.send("Posting a tweet");
}

function getAllTweets(req: Request, res: Response) {
  res.send("Retrieving the global feed");
}

function getPersonalTweets(req: Request, res: Response) {
  res.send("Retrieving the personal feed " + req.params.userId);
}

export { postTweet, getAllTweets, getPersonalTweets };
