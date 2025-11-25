import { RawQlRequest } from "raw_lib";
import PlaylistRepository from "../../repositories/playlist.repository";

export default class GetPlaylistUsecase {
    constructor(private plalyistRepository: PlaylistRepository) { }

    async call(req: RawQlRequest) {
        return this.plalyistRepository.getPlaylist(req);
    }
}
