import { dbClient } from "@repo/db/client";
import { UploadStatusEnum } from "@repo/validation";

export const getVideoDetails = async ({
  uploadId,
  userId,
}: {
  uploadId: string;
  userId: string;
}) => {
  const videoDetails = await dbClient.uploadVideo.findFirst({
    where: {
      uploadId,
      userId,
    },
  });

  return videoDetails;
};

export const addChunkToVideoPart = async (
  chunks: {
    partNumber: number;
    uploadId: string;
    videoId: string;
    etag: string;
  }[],
) => {
  const totalChunk = (
    await dbClient.videoPart.createMany({
      data: chunks,
    })
  ).count;

  return totalChunk;
};
export const updateVideoStatus = async (
  videoId: string,
  status: UploadStatusEnum,
) => {
  return await dbClient.uploadVideo.update({
    where: {
      id: videoId,
    },
    data: {
      status,
    },
  });
};
