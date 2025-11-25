import UserEntity from "../../entities/user.entity";
import UserRepository from "../../repositories/user.repository";

export default class UpdateUserUsecase {
    constructor(private userRepository: UserRepository) { };

    async call(user: Partial<UserEntity>) {
        return this.userRepository.updateProfile(user);
    }
}
