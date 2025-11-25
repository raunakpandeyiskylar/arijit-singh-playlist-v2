import PlaylistEntity from "../../entities/playlist.entity";
import PlaylistRepository from "../../repositories/playlist.repository";

export default class UpdatePlaylistUsecase {
    constructor(private plalyistRepository: PlaylistRepository) { }

    async call(playList: PlaylistEntity) {
        return this.plalyistRepository.updatePlaylist(playList);
    }
}
