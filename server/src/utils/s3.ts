import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const config: S3ClientConfig =
  process.env.NODE_ENV === "production"
    ? {
        region: process.env.AWS_REGION,
        forcePathStyle: true,
      }
    : {
        region: process.env.AWS_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      };

const s3: S3Client = new S3Client(config);

async function imageKeysToPresignedUrl(tweet: any) {
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

export { imageKeysToPresignedUrl, s3 };
