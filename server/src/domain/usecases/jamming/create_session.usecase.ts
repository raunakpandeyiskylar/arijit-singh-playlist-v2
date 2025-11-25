import Jamming from "../../entities/jaming.entity";
import JammingRepository from "../../repositories/jamming.repository";

export default class CreateSessionUsecase {
    constructor(private jammingRepository: JammingRepository) { }

    async call(jamm: Jamming) {
        return this.jammingRepository.createSession(jamm);
    }
}
