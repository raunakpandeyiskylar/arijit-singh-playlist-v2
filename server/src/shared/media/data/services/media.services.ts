
// Media Repositories

import MediaRepository from "../../domain/repositories/media.repository";
import {RawQlEngine, RawQlRequest, RawQlResponse} from "raw_lib";
import MediaEntity from "../../domain/entities/media.entity";

export default class MediaServices implements MediaRepository {
    private engine: RawQlEngine;

    constructor(engine: RawQlEngine) {
        this.engine = engine;
    }

    async operation(req: RawQlRequest): Promise<RawQlResponse<number | MediaEntity>> {
        try {
            return await this.engine.execute<MediaEntity>(req);
        } catch (e: any) {
            return {
                status: false,
                message: e.message,
                data: null,
            }
        }
    }
}
