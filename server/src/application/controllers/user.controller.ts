import { RawQlEngine, RawQlRequest } from "raw_lib";
import userSchema from "../../data/models/user.model";
import GetUserUsecase from "../../domain/usecases/user/get_user.usecase";
import UpdateUserUsecase from "../../domain/usecases/user/update_user.usecase";
import mongoAdapter from "../../shared/infrastructure/database/connection";
import UserService from "../../data/services/user.service";
import { NextFunction, Request, Response } from "express";
import UserEntity from "../../domain/entities/user.entity";
import mediaControllers from "../../shared/media/application/controllers/media.controllers";

class UserController {
    private updateUserUsecase: UpdateUserUsecase;
    private getUserUsecase: GetUserUsecase;

    constructor() {
        const engine = new RawQlEngine(mongoAdapter);
        const userService = new UserService(engine);

        this.updateUserUsecase = new UpdateUserUsecase(userService);
        this.getUserUsecase = new GetUserUsecase(userService);

        this.updateProfile = this.updateProfile.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
    }

    async updateProfile(req: Request, res: Response) {
        try {
            // if (req.user?._id !== req.body?._id) {
            //     throw new Error(`You cannot edit ${req.body?.name || req.body?.username || "Someone else"}'s profile`)
            // }

            if (req.file || req.files) {
                await mediaControllers.handleMediaSave(req, res);
            }

            return res.success(await this.updateUserUsecase.call(req.body as Partial<UserEntity>))
        } catch (error: any) {
            return res.error({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }

    async getUserProfile(req: Request, res: Response) {
        try {
            return res.success(await this.getUserUsecase.call(req.body as RawQlRequest))
        } catch (error: any) {
            return res.error({
                status: false,
                message: error.message,
                data: null,
            });
        }
    }
}

export default new UserController();
