import { RawQlRequest } from "raw_lib";
import SongsRepository from "../../repositories/songs.repository";

export default class GetSongUsecase {
    constructor(private songRepository: SongsRepository) { }

    async call(req: RawQlRequest) {
        return this.songRepository.getSong(req);
    }
}

