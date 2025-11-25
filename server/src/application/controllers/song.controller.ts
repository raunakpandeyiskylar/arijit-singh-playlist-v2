import { RawQlEngine, RawQlRequest } from "raw_lib";
import songSchema from "../../data/models/song.model";
import CreateSongUsecase from "../../domain/usecases/songs/create_song.usecase";
import GetSongUsecase from "../../domain/usecases/songs/get_song.usecase";
import UpdateSongUsecase from "../../domain/usecases/songs/update_song.usecase";
import mongoAdapter from "../../shared/infrastructure/database/connection";
import SongServices from "../../data/services/songs.service";
import { Request, Response } from "express";
import SongEntity from "../../domain/entities/song.entity";
import mediaControllers from "../../shared/media/application/controllers/media.controllers";

class SongController {
    private createSongUsecase: CreateSongUsecase;
    private updateSongUsecase: UpdateSongUsecase;
    private getSongUsecase: GetSongUsecase;

    constructor() {
        mongoAdapter.registerModel("Song", songSchema);
        const service = new SongServices(new RawQlEngine(mongoAdapter));

        this.createSongUsecase = new CreateSongUsecase(service);
        this.getSongUsecase = new GetSongUsecase(service);
        this.updateSongUsecase = new UpdateSongUsecase(service);

        this.createSong = this.createSong.bind(this);
        this.getSong = this.getSong.bind(this);
    }

    async createSong(req: Request, res: Response) {
        try {
            const { name, artists } = req.body;
            const song = await this.createSongUsecase.call({ name, artists, createdBy: req.user } as SongEntity);

            req.body = { ...req.body, _id: song.data?.type === "single" ? song.data?.item._id : song.data?.items[0]._id, };
            await mediaControllers.handleMediaSave(req, res);

            console.log("Uploaded Media", req.uploadedMedia, req.uploadedMedias);


            return res.success(await this.getSongUsecase.call({
                entity: "Song",
                type: 'aggregate',
                pipeline: [
                    {
                        match: {
                            field: "_id",
                            op: "eq",
                            value: req.body?._id
                        }
                    },
                    {
                        lookup: {
                            foreignField: "ref_id",
                            localField: "_id",
                            from: "media",
                            as: "coverImage",
                            pipeline: [
                                {
                                    match: {
                                        field: "ref_code",
                                        op: "eq",
                                        value: "song_cover"
                                    }
                                },
                                {
                                    project: {
                                        path: 1,
                                        local: 1,
                                        mimeType: 1
                                    }
                                },
                                {
                                    limit: 1,
                                },
                            ]
                        }
                    },
                    {
                        lookup: {
                            foreignField: "ref_id",
                            localField: "_id",
                            from: "media",
                            as: "song",
                            pipeline: [
                                {
                                    match: {
                                        field: "ref_code",
                                        op: "eq",
                                        value: "song"
                                    }
                                },
                                {
                                    project: {
                                        path: 1,
                                        local: 1,
                                        mimeType: 1
                                    }
                                },
                                {
                                    limit: 1,
                                }
                            ]
                        }
                    },
                    {
                        unwind: {
                            path: "coverImage",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        unwind: {
                            path: "song",
                            preserveNullAndEmptyArrays: true,
                        },
                    }
                ]
            }))
        } catch (error: any) {
            return res.error({
                status: false,
                message: error.message || "Inernal Server Error",
                data: null,
            })
        }
    }

    async getSong(req: Request, res: Response) {
        try {
            return res.success(await this.getSongUsecase.call(req.body as RawQlRequest))
        } catch (error: any) {
            return res.error({
                status: false,
                message: error.message || "Inernal Server Error",
                data: null,
            })
        }
    }
}

export default new SongController();
