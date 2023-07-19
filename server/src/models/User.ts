import dynamoose from "dynamoose";

const UserSchema = new dynamoose.Schema({
  handle: {
    type: String,
    hashKey: true,
  },
  username: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  location: String,
  website: String,
  createdAt: {
    type: Number,
    default: Math.floor(Date.now() / 1000),
    rangeKey: true,
  },
});

export default dynamoose.model("User", UserSchema);
