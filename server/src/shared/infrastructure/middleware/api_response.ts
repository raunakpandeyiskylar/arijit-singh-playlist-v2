import { Request, Response, NextFunction } from "express";
import {RawQlResponse} from "raw_lib";
import MediaEntity from "../../media/domain/entities/media.entity";

declare global {
  namespace Express {
    interface Response {
      success: <T>(response: RawQlResponse<number | T>) => void;
      error: <T>(response: RawQlResponse<number | T>) => void;
    }
  }

  interface Request {
        token: string,
        // Create your UserEntity and call here user: UserEntity,
        uploadedMedia: MediaEntity,
        uploadedMedias: MediaEntity[],
    }
}

export default function apiResponse(req: Request, res: Response, next: NextFunction) {
   res.success = function <T>(response: RawQlResponse<number | T>) {
    res.json(response);
  };

  res.error = function <T>(response: RawQlResponse<number | T>) {
    res.json(response);
  };

  next();
}
