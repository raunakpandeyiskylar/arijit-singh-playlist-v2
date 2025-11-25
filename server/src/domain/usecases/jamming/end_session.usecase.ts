import Jamming from "../../entities/jaming.entity";
import JammingRepository from "../../repositories/jamming.repository";

export default class EndSessionUsecase {
    constructor(private jammingRepository: JammingRepository) { }

    async call(jamm: Jamming) {
        return this.jammingRepository.endSession(jamm);
    }
}
