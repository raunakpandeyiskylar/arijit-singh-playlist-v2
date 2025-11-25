import { RawQlEngine, RawQlRequest, RawQlResponse } from "raw_lib";
import SongsRepository from "../../domain/repositories/songs.repository"
import SongEntity from "../../domain/entities/song.entity";

export default class SongServices implements SongsRepository {
    constructor(private engine: RawQlEngine) { }

    async createSong(song: SongEntity): Promise<RawQlResponse<SongEntity>> {
        return await this.engine.execute({
            entity: "Song",
            type: "create",
            data: song,
        }) as RawQlResponse<SongEntity>;
    }

    async updateSong(song: Partial<SongEntity>): Promise<RawQlResponse<SongEntity>> {
        return await this.engine.execute({
            type: "update",
            entity: "Song",
            id: song._id,
            data: song,
        }) as RawQlResponse<SongEntity>;
    }

    async getSong(req: RawQlRequest): Promise<RawQlResponse<number | SongEntity>> {
        if (["create", "update", "delete"].includes(req.type)) {
            throw new Error("You are not allowed to perform these actions");
        }

        return await this.engine.execute(req);
    }
}
