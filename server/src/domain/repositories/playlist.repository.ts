import { RawQlRequest, RawQlResponse } from "raw_lib";
import PlaylistEntity from "../entities/playlist.entity";

export default abstract class PlaylistRepository {
    abstract createPlaylist(playlist: PlaylistEntity): Promise<RawQlResponse<PlaylistEntity>>;
    abstract updatePlaylist(playlist: Partial<PlaylistEntity>): Promise<RawQlResponse<PlaylistEntity>>;
    abstract getPlaylist(req: RawQlRequest): Promise<RawQlResponse<number | PlaylistEntity>>;
}
