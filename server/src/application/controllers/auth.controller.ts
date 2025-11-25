import { RawQlEngine } from "raw_lib";
import userSchema from "../../data/models/user.model";
import LoginUsecase from "../../domain/usecases/auth/login.usecase";
import LogoutUsecase from "../../domain/usecases/auth/logout.usecase";
import SignupUsecase from "../../domain/usecases/auth/signup.usecase";
import mongoAdapter from "../../shared/infrastructure/database/connection";
import AuthServices from "../../data/services/auth.service";
import { Request, Response } from "express";
import UserEntity from "../../domain/entities/user.entity";

class AuthController {
    private loginUsecase: LoginUsecase;
    private signupUsecase: SignupUsecase;
    private logoutUsecase: LogoutUsecase;

    constructor() {
        mongoAdapter.registerModel("User", userSchema);
        const engine = new RawQlEngine(mongoAdapter);
        const authService = new AuthServices(engine);

        this.loginUsecase = new LoginUsecase(authService);
        this.signupUsecase = new SignupUsecase(authService);
        this.logoutUsecase = new LogoutUsecase(authService);

        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login(req: Request, res: Response) {
        try {
            return res.success(await this.loginUsecase.call(req.body));
        } catch (error: any) {
            return res.error({ status: false, message: error.message, data: null });
        }
    }

    async signup(req: Request, res: Response) {
        try {
            return res.success(await this.signupUsecase.call(req.body as UserEntity));
        } catch (error: any) {
            return res.error({ status: false, message: error.message, data: null });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            return res.success(await this.logoutUsecase.call(req.token, req.user));
        } catch (error: any) {
            return res.error({ status: false, message: error.message, data: null });
        }
    }
}

export default new AuthController();
