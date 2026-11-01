import { Request, Response } from "express";
import { z } from "zod";
import {
  completeVideoUploadSchema,
  initializeVideoUpload,
  UploadStatusEnum,
} from "@repo/validation";
import {
  completeFileUploadToS3,
  generatePreSignedUrl,
  initilizeUpload,
} from "@repo/aws";
import { dbClient } from "@repo/db/client";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseHandler } from "../utils/responseHandler.js";
import { validateHandler } from "../utils/validationHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import {
  addChunkToVideoPart,
  getVideoDetails,
  updateVideoStatus,
} from "../repository/vide.repo.js";
export const getAllUserVideo = asyncHandler(
  async (req: Request, res: Response) => {
    return res.json({
      success: true,
      message: "Here your all videos",
      videos: [],
    });
  },
);

export const initializeVideoUploadService = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return errorHandler(res, 401, "User Id not found");
      }

      const validResponse = validateHandler(
        res,
        initializeVideoUpload,
        req.body,
      );

      if (validResponse && !validResponse["success"]) {
        return validResponse.response;
      }

      const validData = validResponse.response as z.infer<
        typeof initializeVideoUpload
      >;
      const { fileName, fileType, fileSize } = validData;

      // How Many Chunks to be done for this file :-
      const totalChunks = Math.ceil(fileSize / Number(process.env.CHUNK_SIZE!));

      // Call the aws S3 function :-

      const key = fileName + Date.now();
      const response = await initilizeUpload({ fileName, fileType, key });

      if (!response.UploadId || !response.Key) {
        throw new Error("Upload id or Key from S3 not found");
      }

      // Also generate the Pre-signed URL for frontend for each chunk upload :-

      const partsPreSignedUrlData: {
        partNumber: number;
        presignedUrl: string;
      }[] = [];

      for (let i = 1; i <= totalChunks; i++) {
        const presignedUrl = await generatePreSignedUrl({
          uploadId: response.UploadId,
          key: response.Key,
          partNumber: i,
        });

        partsPreSignedUrlData.push({ partNumber: i, presignedUrl });
      }

      // Store the response in the VideoUpload Table :-
      await dbClient.uploadVideo.create({
        data: {
          filename: fileName,
          mimeType: fileType,
          s3Key: response.Key,
          fileSize,
          uploadId: response.UploadId,
          status: "initialized",
          userId: req.userId,
        },
      });

      return responseHandler(res, 201, "Video uploadation initialized", {
        uploadId: response.UploadId,
        key: response.Key,
        chunks: partsPreSignedUrlData,
      });
    } catch (error) {
      console.log(error);
    }
  },
);

export const completeVideoUploadController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      return errorHandler(res, 401, "User Id not found");
    }

    const validResponse = validateHandler(
      res,
      completeVideoUploadSchema,
      req.body,
    );

    if (validResponse && !validResponse["success"]) {
      return validResponse.response;
    }

    const validData = validResponse.response as z.infer<
      typeof completeVideoUploadSchema
    >;
    const { chunks, uploadId } = validData;

    // Verify the same uploader of this video :-
    const videoDetails = await getVideoDetails({
      uploadId,
      userId: req.userId,
    });

    if (!videoDetails) {
      return errorHandler(res, 404, "Invalid uploadId");
    }

    const key = videoDetails.s3Key;

    const totalChunks = chunks.map(({ eTag, partNumber }) => ({
      etag: eTag,
      partNumber,
      uploadId,
      videoId: videoDetails.id,
    }));

    // Store the chunk of the video in the video Part :-
    const totalInsertedChunks = await addChunkToVideoPart(totalChunks);

    if (totalInsertedChunks !== chunks.length) {
      return errorHandler(
        res,
        500,
        "Total Inserted chunks are not equal to actual chunks",
      );
    }

    // Stitch the file into one file on S3 :-

    const uploadCompleteResponse = await completeFileUploadToS3({
      uploadId,
      key,
    });

    if (!uploadCompleteResponse.Key) {
      return errorHandler(res, 500, "Something failed in stitching the file");
    }

    // Update the status of file uploaded :-
    await updateVideoStatus(videoDetails.id, UploadStatusEnum.uploaded);

    return responseHandler(res, 200, "File Uploaded completed on S3");
  },
);
