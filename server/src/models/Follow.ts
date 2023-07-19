import dynamoose from "dynamoose";

const FollowSchema = new dynamoose.Schema({
  follower: {
    type: String,
    rangeKey: true,
  },
  followed: {
    type: String,
    hashKey: true,
  },
});

export default dynamoose.model("Follow", FollowSchema);
