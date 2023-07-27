import Dynamo from "../models/Dynamo";

async function getUsersByHandle(handle: string) {
  return Dynamo.query("type").eq("USER").where("handle").eq(handle).exec();
}

async function addUser(handle: string, username: string, image: string) {
  const newUser = new Dynamo({
    type: "USER",
    handle: handle,
    username: username,
    image: image,
    createdAt: Math.floor(Date.now() / 1000),
  });
  return newUser.save();
}

async function getUsersByHandles(handles: string[]) {
  return Dynamo.query("type").eq("USER").where("handle").in(handles).exec();
}

export { getUsersByHandle, addUser, getUsersByHandles };
