import AuthRepository from "../../repositories/auth.repository";

export default class LoginUsecase {
    constructor(private authRepository: AuthRepository) { };

    async call({ username, password }: { username: string, password: string }) {
        return this.authRepository.login({ username, password });
    }
}
