
// Media Controllers

import MediaOperationUsecases from "../../domain/usecases/mediaOperation.usecases";
import mongoAdapter from "../../../infrastructure/database/connection";
import mediaSchema from "../../data/models/media.model";
import {RawQlEngine} from "raw_lib";
import MediaServices from "../../data/services/media.services";
import {NextFunction, Request, Response} from "express"
import MediaEntity from "../../domain/entities/media.entity";

class MediaControllers {
    private mediaOperationUsecase: MediaOperationUsecases;

    constructor() {
        mongoAdapter.registerModel("Media", mediaSchema);
        const engine = new RawQlEngine(mongoAdapter);
        const services = new MediaServices(engine);

        this.mediaOperationUsecase = new MediaOperationUsecases(services);
    }

    async handleMediaSave(req: Request, res: Response, next: NextFunction) {
        const file = req.file;
        const files = req.files;

        if (!file && !files) {
            return;
        }

        try {

            if (file) {
                const response = await this.mediaOperationUsecase.execute({
                    entity: "Media",
                    type: "create",
                    data: {
                        path: this.getRelativePath(file.path),
                        mimeType: file.mimetype,
                    } as MediaEntity
                });

                req.uploadedMedia = response.data?.type === "single" ? response.data?.item as MediaEntity : response.data?.items[0] as MediaEntity
            }

            if (files && Array.isArray(files) && files.length > 0) {
                const response = await Promise.all(files.map(async (f) => await this.mediaOperationUsecase.execute({
                                entity: "Media",
                                type: "create",
                                data: {
                                    path: this.getRelativePath(f.path),
                                    mimeType: f.mimetype,
                                } as MediaEntity
                            }
                        )
                    )
                );

                req.uploadedMedias = response.map<MediaEntity>((r) => r.data?.type === "single" ? r.data?.item as MediaEntity : r.data?.items[0] as MediaEntity) as MediaEntity[];
            }

            next();
        } catch (e: any) {
            next(e);
        }
    }

    private getRelativePath(fullPath: string): string {
        const uploadsIndex = fullPath.indexOf('uploads');
        if (uploadsIndex !== -1) {
            return fullPath.substring(uploadsIndex);
        }
        return fullPath;
    }
}

export default new MediaControllers();
