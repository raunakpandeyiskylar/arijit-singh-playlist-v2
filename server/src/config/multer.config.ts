import multer from "multer";
import path from "path";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "node:fs";
import { mkdirSync } from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import envConfig from "./env.config";

cloudinary.config({
  cloud_name: envConfig.accoundId,
  api_key: envConfig.apiKey,
  api_secret: envConfig.apiSecret,
});

// Configure storage
const storage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder,
      public_id: (req: Request, file: Express.Multer.File) => {
        // Generate unique filename with original extension
        return uuidv4();
      },
    },
  });

// Configure multer
const upload = (folder: string) =>
  multer({
    storage: storage(folder),
    // fileFilter: fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  });

export default upload;
