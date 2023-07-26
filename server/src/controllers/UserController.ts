import { Request, Response } from "express";
import User from "../models/User";
import Follow from "../models/Follow";
import Tweet from "../models/Tweet";
import jwt from "jsonwebtoken";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3: S3Client;
if (process.env.NODE_ENV === "production") {
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    forcePathStyle: true,
  });
} else {
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

async function getUser(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      if (!verifiedJwt || typeof verifiedJwt === "string") {
        res.send(401).send({ message: "Unauthorized" });
        return;
      }
      const handle = verifiedJwt.id.split("@")[0];

      // Get user info
      const users = await User.query("handle").eq(userId).exec();
      if (users.length === 0) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      const user = users[0];

      // Get the tweets of the user
      const tweets = await Tweet.query("handle").eq(userId).exec();
      tweets.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      for (let tweet of tweets) {
        // Convert image IDs to presigned URLs
        if (tweet.images) {
          const imageIds = tweet.images.split(",");
          const imageUrls = [];
          for (let id of imageIds) {
            const url = await getSignedUrl(
              s3,
              new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: id,
              }),
              { expiresIn: 3600 }
            );
            imageUrls.push(url);
          }
          tweet.images = imageUrls;
        }
      }

      // Compute the number of followers and following
      const followersCount = (await Follow.query("followed").eq(userId).exec())
        .length;
      const followingCount = (await Follow.query("follower").eq(userId).exec())
        .length;

      if (handle === userId) {
        res.send({
          ...user,
          tweets: tweets,
          followers: followersCount,
          following: followingCount,
        });
        return;
      }

      // Check if the user (handle) is following the user (userId)
      const follow = await Follow.query("follower")
        .eq(handle)
        .where("followed")
        .eq(userId)
        .exec();

      if (follow.length > 0) {
        res.send({
          ...user,
          tweets: tweets,
          followed: true,
          followers: followersCount,
          following: followingCount,
        });
      } else {
        res.send({
          ...user,
          tweets: tweets,
          followed: false,
          followers: followersCount,
          following: followingCount,
        });
      }
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

  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      if (!verifiedJwt || typeof verifiedJwt === "string") {
        res.send(401).send({ message: "Unauthorized" });
        return;
      }

      const handle = verifiedJwt.id.split("@")[0];

      User.query("handle")
        .eq(handle)
        .exec()
        .then((users) => {
          if (users.length === 0) {
            res.status(505).send({ message: "Internal Server Error" });
          } else {
            const user = users[0];
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

  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      if (!verifiedJwt || typeof verifiedJwt === "string") {
        res.send(401).send({ message: "Unauthorized" });
        return;
      }

      const handle = verifiedJwt.id.split("@")[0];

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

  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      res.send(err.message);
    } else {
      if (!verifiedJwt || typeof verifiedJwt === "string") {
        res.send(401).send({ message: "Unauthorized" });
        return;
      }

      const handle = verifiedJwt.id.split("@")[0];

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
  Follow.query("follower")
    .eq(req.params.userId)
    .exec()
    .then((follows) => {
      if (follows.length > 0) {
        const followers = follows.map((follow) => follow.followed);
        User.batchGet(followers).then((users) => {
          res.send(users);
        });
      } else {
        res.send([]);
      }
    });
}

function getFollowers(req: Request, res: Response) {
  Follow.query("followed")
    .eq(req.params.userId)
    .exec()
    .then((follows) => {
      if (follows.length > 0) {
        const followers = follows.map((follow) => follow.follower);
        User.batchGet(followers).then((users) => {
          res.send(users);
        });
      } else {
        res.send([]);
      }
    });
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
