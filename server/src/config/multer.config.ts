
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from "node:fs";
import { mkdirSync } from "fs";

// Configure storage
const storage = (folder: string) => multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'media', folder);

        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        // Generate unique filename with original extension
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Configure multer
const upload = (folder: string) => multer({
    storage: storage(folder),
    // fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
    }
});

export default upload;
