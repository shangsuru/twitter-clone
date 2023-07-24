import { Request, Response } from "express";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

function getUser(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  User.query("handle")
    .eq(userId)
    .exec()
    .then((users) => {
      if (users.length > 0) {
        res.send(users[0]);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    });
}

function createUser(req: Request, res: Response) {
  const { handle, username, image } = req.body;

  if (!handle || !username || !image) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

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
          image: image,
        });
        newUser.save().then((user) => {
          res.send(user);
        });
      }
    });
}

function updateUser(req: Request, res: Response) {
  const { username, bio, location, website } = req.body;
  if (!username) {
    res.status(400).send({ message: "Username cannot be empty" });
    return;
  }

  let authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      if (!verifiedJwt || typeof verifiedJwt == "string") {
        res.send(401).send({ message: "Unauthorized" });
        return;
      }

      verifiedJwt = verifiedJwt;
      const handle = verifiedJwt.id.split("@")[0];

      User.query("handle")
        .eq(handle)
        .exec()
        .then((users) => {
          if (users.length == 0) {
            res.status(505).send({ message: "Internal Server Error" });
          } else {
            let user = users[0];
            user.username = username;
            user.bio = bio;
            user.location = location;
            user.website = website;
            user.save().then((user) => {
              res.send(user);
            });
          }
        });
    }
  });
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
