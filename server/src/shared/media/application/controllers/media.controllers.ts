
// Media Controllers

import MediaOperationUsecases from "../../domain/usecases/mediaOperation.usecases";
import mongoAdapter from "../../../infrastructure/database/connection";
import mediaSchema from "../../data/models/media.model";
import { RawQlEngine } from "raw_lib";
import MediaServices from "../../data/services/media.services";
import { Request, Response } from "express"
import MediaEntity from "../../domain/entities/media.entity";

class MediaControllers {
    private mediaOperationUsecase: MediaOperationUsecases;

    constructor() {
        mongoAdapter.registerModel("Media", mediaSchema);
        const engine = new RawQlEngine(mongoAdapter);
        const services = new MediaServices(engine);

        this.mediaOperationUsecase = new MediaOperationUsecases(services);
    }

    async handleMediaSave(req: Request, res: Response) {
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
                        ref_id: req.body?._id,
                        ref_code: req.body?.ref_code,
                    } as MediaEntity
                });

                req.uploadedMedia = response.data?.type === "single" ? response.data?.item as MediaEntity : response.data?.items[0] as MediaEntity
            }

            if (files && Array.isArray(files) && files.length > 0) {
                const response = await Promise.all(files.map(async (f, index) => await this.mediaOperationUsecase.execute({
                    entity: "Media",
                    type: "create",
                    data: {
                        path: this.getRelativePath(f.path),
                        mimeType: f.mimetype,
                        ref_id: req.body?._id,
                        ref_code: req.body?.ref_code[index],
                    } as MediaEntity
                })));

                req.uploadedMedias = response.map<MediaEntity>((r) => r.data?.type === "single" ? r.data?.item as MediaEntity : r.data?.items[0] as MediaEntity) as MediaEntity[];
            }

            if (files && typeof files === "object" && !Array.isArray(files)) {
                const fileMap = files as { [fieldname: string]: Express.Multer.File[] };
                const allFiles: { file: Express.Multer.File; ref_code: string }[] = [];

                Object.keys(fileMap).forEach(field => {
                    const filesOfField = fileMap[field];

                    if (Array.isArray(filesOfField)) {
                        filesOfField.forEach(f => {
                            allFiles.push({
                                file: f,
                                ref_code: Array.isArray(req.body.ref_code)
                                    ? req.body.ref_code.shift()
                                    : req.body.ref_code
                            });
                        });
                    }
                });

                const responses = await Promise.all(
                    allFiles.map(({ file, ref_code }) =>
                        this.mediaOperationUsecase.execute({
                            entity: "Media",
                            type: "create",
                            data: {
                                path: this.getRelativePath(file.path),
                                mimeType: file.mimetype,
                                ref_id: req.body?._id,
                                ref_code
                            } as MediaEntity
                        })
                    )
                );

                req.uploadedMedias = responses.map(r =>
                    r.data?.type === "single"
                        ? (r.data.item as MediaEntity)
                        : (r.data?.items?.[0] as MediaEntity)
                );
            }

        } catch (e: any) {
            throw e;
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
