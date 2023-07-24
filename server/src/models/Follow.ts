import dynamoose from "dynamoose";

const FollowSchema = new dynamoose.Schema({
  follower: {
    type: String,
    index: true,
  },
  followed: {
    type: String,
    hashKey: true,
  },
});

export default dynamoose.model("Follow", FollowSchema);
