import { RawQlEngine, RawQlRequest, RawQlResponse } from "raw_lib";
import PlaylistRepository from "../../domain/repositories/playlist.repository";
import PlaylistEntity from "../../domain/entities/playlist.entity";

export default class PlatlilstService implements PlaylistRepository {
    constructor(private engine: RawQlEngine) { }

    async createPlaylist(playlist: PlaylistEntity): Promise<RawQlResponse<PlaylistEntity>> {
        return await this.engine.execute({
            entity: "Playlist",
            type: "create",
            data: playlist,
        }) as RawQlResponse<PlaylistEntity>;
    }

    async updatePlaylist(playlist: Partial<PlaylistEntity>): Promise<RawQlResponse<PlaylistEntity>> {
        return await this.engine.execute({
            type: "update",
            entity: "Playlist",
            id: playlist._id,
            data: playlist,
        }) as RawQlResponse<PlaylistEntity>
    }

    async getPlaylist(req: RawQlRequest): Promise<RawQlResponse<number | PlaylistEntity>> {
        if (["create", "update", "delete"].includes(req.type)) {
            throw new Error("You are not allowed to perform these actions");
        }

        return await this.engine.execute(req)
    }
}
