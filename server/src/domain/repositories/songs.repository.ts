import { RawQlRequest, RawQlResponse } from "raw_lib";
import SongEntity from "../entities/song.entity";

export default abstract class SongsRepository {
    abstract createSong(song: SongEntity): Promise<RawQlResponse<SongEntity>>;
    abstract updateSong(song: Partial<SongEntity>): Promise<RawQlResponse<SongEntity>>;
    abstract getSong(req: RawQlRequest): Promise<RawQlResponse<number | SongEntity>>;
}
