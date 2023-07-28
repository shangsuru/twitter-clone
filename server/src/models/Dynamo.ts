import dynamoose from "dynamoose";

const SingleTableSchema = new dynamoose.Schema({
  type: {
    // User, Follow, Tweets
    type: String,
    hashKey: true,
  },

  // User
  handle: {
    type: String,
    index: true,
  },
  username: String,
  image: String,
  bio: String,
  location: String,
  website: String,
  createdAt: {
    type: Number,
    rangeKey: true,
  },

  // Follow
  follower: {
    type: String,
    index: true,
  },
  followed: {
    type: String,
    index: true,
  },

  // Tweets
  id: {
    type: String,
    index: true,
  },
  text: String,
  images: String,
  // handle, createdAt
});

export default dynamoose.model("Dynamo", SingleTableSchema);
