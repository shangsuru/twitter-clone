import { Request, Response } from "express";

function getUser(req: Request, res: Response) {
  res.send("Read profile information");
}

function updateUser(req: Request, res: Response) {
  res.send("Update profile information");
}

function followUser(req: Request, res: Response) {
  res.send(`Follow the user ${req.params.userId}`);
}

function unfollowUser(req: Request, res: Response) {
  res.send(`Unfollow the user ${req.params.userId}`);
}

function getFollowing(req: Request, res: Response) {
  res.send(`Get users that the user ${req.params.userId} follows`);
}

function getFollowers(req: Request, res: Response) {
  res.send(`Get users that follow the user ${req.params.userId}`);
}

export {
  getUser,
  updateUser,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
};
