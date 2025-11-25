import PlaylistEntity from "../../entities/playlist.entity";
import PlaylistRepository from "../../repositories/playlist.repository";

export default class CreatePlaylistUsecase {
    constructor(private plalyistRepository: PlaylistRepository) { }

    async call(playList: PlaylistEntity) {
        return this.plalyistRepository.createPlaylist(playList);
    }
}
