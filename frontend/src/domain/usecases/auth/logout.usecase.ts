import UserEntity from "../../entities/user.entity";
import AuthRepository from "../../repositories/auth.repository";

export default class LogoutUsecase {
    constructor(private authRepository: AuthRepository) { };

    async call() {
        return this.authRepository.logout();
    }
}

