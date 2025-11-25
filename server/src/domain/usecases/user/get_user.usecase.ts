import { RawQlRequest } from "raw_lib";
import UserRepository from "../../repositories/user.repository";

export default class GetUserUsecase {
    constructor(private userRepository: UserRepository) { };

    async call(req: RawQlRequest) {
        return this.userRepository.getUserProfile(req);
    }
}
