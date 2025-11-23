
import { Request, Response, NextFunction } from 'express';
import upload from "../../../config/multer.config";
import mediaControllers from "../../media/application/controllers/media.controllers";

export function mediaUploadMiddleware(fieldName: string, folder: string, maxCount?: number) {
    const uploadMiddleware = maxCount
        ? upload(folder).array(fieldName, maxCount)
        : upload(folder).single(fieldName);

    return async (req: Request, res: Response, next: NextFunction) => {
        uploadMiddleware(req, res, async (err) => {
            if (err) {
                return res.error({
                    status: false,
                    message: err.message,
                    data: null,
                });
            }

            try {

                if (!req.file && (!req.files || (Array.isArray(req.files) && req.files.length === 0))) {
                    return next();
                }

                await mediaControllers.handleMediaSave(req, res, next);
            } catch (error) {
                console.error('Media upload error:', error);
                return res.error({
                    status: false,
                    message: 'Failed to process uploaded media',
                    data: null,
                });
            }
        });
    };
}

// Specific middleware helpers 11for common use cases
export const singleMediaMiddleware = (fieldName: string = 'media', folder: string) => {
    return mediaUploadMiddleware(fieldName, folder);
};

export const multipleMediaMiddleware = (fieldName: string = 'media', folder: string, maxCount: number = 10) => {
    return mediaUploadMiddleware(fieldName, folder, maxCount);
};
