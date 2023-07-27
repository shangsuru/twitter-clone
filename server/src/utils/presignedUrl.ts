import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function imageKeysToPresignedUrl(
  s3: S3Client,
  tweet: any
) {
  if (tweet.images) {
    const imageIds = tweet.images.split(",");
    const imageUrls = [];
    for (let id of imageIds) {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: id,
        }),
        { expiresIn: 3600 }
      );
      imageUrls.push(url);
    }
    tweet.images = imageUrls;
  }
}
