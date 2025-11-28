import UserEntity from "../../entities/user.entity";
import AuthRepository from "../../repositories/auth.repository";

export default class SignupUsecase {
    constructor(private authRepository: AuthRepository) { };

    async call(user: Partial<UserEntity>) {
        return this.authRepository.signup(user);
    }
}

