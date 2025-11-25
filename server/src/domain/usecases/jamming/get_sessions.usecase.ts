import { RawQlRequest } from "raw_lib";
import JammingRepository from "../../repositories/jamming.repository";

export default class GetSessionUsecase {
    constructor(private jammingRepository: JammingRepository) { }

    async call(req: RawQlRequest) {
        return this.jammingRepository.getsessions(req);
    }
}
