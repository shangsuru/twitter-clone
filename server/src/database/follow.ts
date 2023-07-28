import Dynamo from "../models/Dynamo";

async function getFollowed(userId: string) {
  return Dynamo.query("type").eq("FOLLOW").where("follower").eq(userId).exec();
}

async function getFollowersCount(userId: string) {
  return (
    await Dynamo.query("type")
      .eq("FOLLOW")
      .where("followed")
      .eq(userId)
      .count()
      .exec()
  ).count;
}

async function getFollowingCount(userId: string) {
  return (
    await Dynamo.query("type")
      .eq("FOLLOW")
      .where("follower")
      .eq(userId)
      .count()
      .exec()
  ).count;
}

async function getFollows(user1: string, user2: string) {
  return Dynamo.query("type")
    .eq("FOLLOW")
    .where("follower")
    .eq(user1)
    .and()
    .where("followed")
    .eq(user2)
    .exec();
}

async function follows(user1: string, user2: string): Promise<boolean> {
  const follow = await getFollows(user1, user2);
  return follow.length > 0;
}

async function addFollow(follower: string, followed: string) {
  const follow = new Dynamo({
    type: "FOLLOW",
    follower: follower,
    followed: followed,
    createdAt: Math.floor(Date.now() / 1000),
  });
  return follow.save();
}

async function getFollowersOf(userId: string) {
  return Dynamo.query("type").eq("FOLLOW").where("followed").eq(userId).exec();
}

export {
  getFollowed,
  getFollowersCount,
  getFollowingCount,
  follows,
  addFollow,
  getFollows,
  getFollowersOf,
};
