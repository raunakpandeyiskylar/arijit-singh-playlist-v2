import UserEntity from "../../entities/user.entity";
import AuthRepository from "../../repositories/auth.repository";

export default class LogoutUsecase {
    constructor(private authRepository: AuthRepository) { };

    async call(token: string, user: UserEntity) {
        return this.authRepository.logout(token, user);
    }
}

