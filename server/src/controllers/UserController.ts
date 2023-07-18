import { Request, Response } from "express";
import User from "../models/User";

function getUser(req: Request, res: Response) {
  res.send("Read profile information");
}

function createUser(req: Request, res: Response) {
  const { handle, username } = req.body;

  User.query("handle")
    .eq(handle)
    .exec()
    .then((users) => {
      if (users.length > 0) {
        res.status(403).send({ message: "User already exists" });
      } else {
        const newUser = new User({
          handle: handle,
          username: username,
        });
        newUser.save().then((user) => {
          res.send(user);
        });
      }
    });
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
  createUser,
};
