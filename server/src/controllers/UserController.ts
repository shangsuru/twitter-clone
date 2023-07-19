import { Request, Response } from "express";
import User from "../models/User";
import Follow from "../models/Follow";
import jwt from "jsonwebtoken";

function getUser(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  let authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      const handle = (verifiedJwt! as jwt.JwtPayload).id.split("@")[0];

      User.query("handle")
        .eq(userId)
        .exec()
        .then((users) => {
          if (users.length > 0) {
            let user = users[0];

            if (handle == userId) {
              res.send(user);
              return;
            }

            // Check if the user (handle) is following the user (userId)
            Follow.query("follower")
              .eq(handle)
              .where("followed")
              .eq(userId)
              .exec()
              .then((follows) => {
                if (follows.length > 0) {
                  res.send({ ...user, followed: true });
                } else {
                  res.send({ ...user, followed: false });
                }
              });
          } else {
            res.status(404).send({ message: "User not found" });
          }
        });
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
  if (!username || !bio || !location || !website) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  let authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      const handle = (verifiedJwt! as jwt.JwtPayload).id.split("@")[0];

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
  const { userId } = req.body;
  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  let authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      const handle = (verifiedJwt! as jwt.JwtPayload).id.split("@")[0];

      const newFollower = new Follow({
        follower: handle,
        followed: userId,
      });
      newFollower.save().then((follow) => {
        res.send(follow);
      });
    }
  });
}

function unfollowUser(req: Request, res: Response) {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  let authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      const handle = (verifiedJwt! as jwt.JwtPayload).id.split("@")[0];

      Follow.delete({
        follower: handle,
        followed: userId,
      }).then(() => {
        res.send("Unfollowed user");
      });
    }
  });
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
