import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { dbClient } from "@repo/db/client";
import { AWS_S3_BUCKET, client } from "./configuration.s3.js";
import { compose } from "node:stream";

export const initilizeUpload = async ({
  fileName,
  fileType,
  key,
}: {
  fileName: string;
  fileType: string;
  key: string;
}) => {
  const initilizedCmd = new CreateMultipartUploadCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  });

  const response = await client.send(initilizedCmd);

  console.log("Initialized Response ", response);
  return response;
};

export const generatePreSignedUrl = async (partData: {
  uploadId: string;
  key: string;
  partNumber: number;
}) => {
  const { uploadId, key, partNumber } = partData;

  const uploadPartCmd = new UploadPartCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    PartNumber: partNumber,
    UploadId: uploadId,
  });

  // Generating the pre-signed url for this upload part cmd :-
  const preSignedUrl = await getSignedUrl(client, uploadPartCmd, {
    expiresIn: 3600,
  });

  return preSignedUrl;
};

// Function for marking the upload to complete :-

export const completeFileUploadToS3 = async ({
  uploadId,
  key,
}: {
  uploadId: string;
  key: string;
}) => {
  // Figureout the Uploaded Part from UploadId :-
  const videoParts = await dbClient.videoPart.findMany({
    where: {
      uploadId,
    },
    select: {
      id: true,
      partNumber: true,
      etag: true,
    },
  });

  console.log({ videoParts });

  const parts = videoParts
    .filter((partDetails) => partDetails.etag && partDetails.partNumber)
    .sort((a, b) => a.partNumber - b.partNumber)
    .map((partDetails) => ({
      ETag: String(partDetails.etag.trim()),
      PartNumber: Number(partDetails.partNumber),
    }));

  // Logging the parts :-
  console.log("Parts after processing ", parts);

  console.log("Data for send ", AWS_S3_BUCKET, key, uploadId, parts);
  const completeUploadCmd = new CompleteMultipartUploadCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  const response = await client.send(completeUploadCmd);

  console.log("Complete upload response ", response);

  return response;
};
