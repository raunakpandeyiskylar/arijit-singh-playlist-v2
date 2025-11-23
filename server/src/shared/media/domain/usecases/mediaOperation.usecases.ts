
import MediaRepository from "../repositories/media.repository";
import {RawQlRequest} from "raw_lib";

export default class MediaOperationUsecases {
    private mediaRepository: MediaRepository;

    constructor(mediaRepo: MediaRepository) {
        this.mediaRepository = mediaRepo;
    }

    execute = async (req: RawQlRequest) => await this.mediaRepository.operation(req);
}
