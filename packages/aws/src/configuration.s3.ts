import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

export const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY;
export const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
export const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION;

export const client = new S3Client({
  region: AWS_S3_BUCKET_REGION!,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY!,
    secretAccessKey: AWS_S3_SECRET_KEY!,
  },
});
