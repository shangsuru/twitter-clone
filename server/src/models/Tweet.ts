import dynamoose from "dynamoose";

const TweetsSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  handle: {
    type: String,
    index: true,
  },
  text: String,
  createdAt: {
    type: Number,
    default: Math.floor(Date.now() / 1000),
  },
});

export default dynamoose.model("Tweet", TweetsSchema);
