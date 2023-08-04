import { Request, Response } from "express";
import { imageKeysToPresignedUrl } from "../database/images";
import { addUser, getUsersByHandle, getUsersByHandles } from "../database/user";
import { getTweetsByUser } from "../database/tweet";
import {
  addFollow,
  follows,
  getFollowed,
  getFollowersCount,
  getFollowersOf,
  getFollowingCount,
  getFollows,
} from "../database/follow";

async function getUser(req: Request, res: Response) {
  const { userId } = req.params;
  const handle = req.body.handle;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  const users = await getUsersByHandle(userId);
  if (users.length === 0) {
    res.status(404).send({ message: "User not found" });
    return;
  }
  const user = users[0];

  const tweets = await getTweetsByUser(userId);

  for (const tweet of tweets) {
    await imageKeysToPresignedUrl(tweet);
  }

  const followersCount = await getFollowersCount(userId);
  const followingCount = await getFollowingCount(userId);

  if (handle === userId) {
    res.send({
      ...user,
      tweets: tweets,
      followers: followersCount,
      following: followingCount,
    });
    return;
  }

  if (await follows(handle, userId)) {
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

  getUsersByHandle(handle).then((users) => {
    if (users.length > 0) {
      res.status(403).send({ message: "User already exists" });
    } else {
      addUser(handle, username, image).then((user) => {
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

  getUsersByHandle(handle).then((users) => {
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

  addFollow(handle, userId).then((follow) => {
    res.send(follow);
  });
}

function unfollowUser(req: Request, res: Response) {
  const { userId, handle } = req.body;

  if (!userId) {
    res.status(400).send({ message: "Bad Request" });
    return;
  }

  getFollows(handle, userId).then((follow) => {
    if (follow.length > 0) {
      follow[0].delete().then(() => {
        res.send("Unfollowed user");
      });
    }
  });
}

function getFollowing(req: Request, res: Response) {
  getFollowed(req.params.userId).then((follows) => {
    if (follows.length > 0) {
      const followers = follows.map((follow) => follow.followed);
      getUsersByHandles(followers).then((users) => {
        res.send(users);
      });
    } else {
      res.send([]);
    }
  });
}

function getFollowers(req: Request, res: Response) {
  getFollowersOf(req.params.userId).then((follows) => {
    if (follows.length > 0) {
      const followers = follows.map((follow) => follow.follower);
      getUsersByHandles(followers).then((users) => {
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
