import { z } from "zod";

export const initializeVideoUpload = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
});

export const completeVideoUploadSchema = z.object({
  uploadId: z.string(),
  chunks: z.array(
    z.object({
      partNumber: z.number().nonnegative(),
      eTag: z.string().nonempty(),
    }),
  ),
});
