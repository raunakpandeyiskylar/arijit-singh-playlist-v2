import SongEntity from "../../entities/song.entity";
import SongsRepository from "../../repositories/songs.repository";

export default class CreateSongUsecase {
    constructor(private songRepository: SongsRepository) { }

    async call(song: SongEntity) {
        return this.songRepository.createSong(song);
    }
}
