import { Request, Response } from "express";
import Dynamo from "../models/Dynamo";
import { imageKeysToPresignedUrl } from "../utils/s3";

async function getUser(req: Request, res: Response) {
  const { userId } = req.params;
  const handle = req.body.handle;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  // Get user info
  const users = await Dynamo.query("type")
    .eq("USER")
    .where("handle")
    .eq(userId)
    .exec();
  if (users.length === 0) {
    res.status(404).send({ message: "User not found" });
    return;
  }
  const user = users[0];

  // Get the tweets of the user
  const tweets = await Dynamo.query("type")
    .eq("TWEET")
    .where("handle")
    .eq(userId)
    .sort("descending")
    .exec();

  for (let tweet of tweets) {
    await imageKeysToPresignedUrl(tweet);
  }

  // Compute the number of followers and following
  const followersCount = (
    await Dynamo.query("type")
      .eq("FOLLOW")
      .where("followed")
      .eq(userId)
      .count()
      .exec()
  ).count;
  const followingCount = (
    await Dynamo.query("type")
      .eq("FOLLOW")
      .where("follower")
      .eq(userId)
      .count()
      .exec()
  ).count;

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
  const follow = await Dynamo.query("type")
    .eq("FOLLOW")
    .where("follower")
    .eq(handle)
    .and()
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

function createUser(req: Request, res: Response) {
  const { handle, username, image } = req.body;

  if (!handle || !username || !image) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  Dynamo.query("type")
    .eq("USER")
    .where("handle")
    .eq(handle)
    .exec()
    .then((users) => {
      if (users.length > 0) {
        res.status(403).send({ message: "User already exists" });
      } else {
        const newUser = new Dynamo({
          type: "USER",
          handle: handle,
          username: username,
          image: image,
          createdAt: Math.floor(Date.now() / 1000),
        });
        newUser.save().then((user) => {
          res.send(user);
        });
      }
    });
}

function updateUser(req: Request, res: Response) {
  const { username, bio, location, website, handle } = req.body;

  if (!username) {
    res.status(400).send({ message: "Username cannot be empty" });
    return;
  }

  if (
    username.length > 30 ||
    bio.length > 160 ||
    location.length > 30 ||
    website.length > 30
  ) {
    res.status(400).send({ message: "Input too long" });
    return;
  }

  Dynamo.query("type")
    .eq("USER")
    .where("handle")
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

function followUser(req: Request, res: Response) {
  const { userId, handle } = req.body;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  const newFollower = new Dynamo({
    type: "FOLLOW",
    follower: handle,
    followed: userId,
    createdAt: Math.floor(Date.now() / 1000),
  });
  newFollower.save().then((follow) => {
    res.send(follow);
  });
}

function unfollowUser(req: Request, res: Response) {
  const { userId, handle } = req.body;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  Dynamo.query("type")
    .eq("FOLLOW")
    .where("follower")
    .eq(handle)
    .and()
    .where("followed")
    .eq(userId)
    .exec()
    .then((follow) => {
      if (follow.length > 0) {
        follow[0].delete().then(() => {
          res.send("Unfollowed user");
        });
      }
    });
}

function getFollowing(req: Request, res: Response) {
  Dynamo.query("type")
    .eq("FOLLOW")
    .where("follower")
    .eq(req.params.userId)
    .exec()
    .then((follows) => {
      if (follows.length > 0) {
        const followers = follows.map((follow) => follow.followed);
        Dynamo.query("type")
          .eq("USER")
          .where("handle")
          .in(followers)
          .exec()
          .then((users) => {
            res.send(users);
          });
      } else {
        res.send([]);
      }
    });
}

function getFollowers(req: Request, res: Response) {
  Dynamo.query("type")
    .eq("FOLLOW")
    .where("followed")
    .eq(req.params.userId)
    .exec()
    .then((follows) => {
      if (follows.length > 0) {
        const followers = follows.map((follow) => follow.follower);
        Dynamo.query("type")
          .eq("USER")
          .where("handle")
          .in(followers)
          .exec()
          .then((users) => {
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
