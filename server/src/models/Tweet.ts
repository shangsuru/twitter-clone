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
    required: true,
  },
  images: String,
});

export default dynamoose.model("Tweet", TweetsSchema);
