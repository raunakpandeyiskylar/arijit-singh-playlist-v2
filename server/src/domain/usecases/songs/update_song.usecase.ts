import SongEntity from "../../entities/song.entity";
import SongsRepository from "../../repositories/songs.repository";

export default class UpdateSongUsecase {
    constructor(private songRepository: SongsRepository) { }

    async call(song: Partial<SongEntity>) {
        return this.songRepository.updateSong(song);
    }
}
