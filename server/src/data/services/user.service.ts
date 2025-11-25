import { RawQlEngine, RawQlRequest, RawQlResponse } from "raw_lib";
import UserEntity from "../../domain/entities/user.entity";
import UserRepository from "../../domain/repositories/user.repository";

export default class UserService implements UserRepository {
    constructor(private engine: RawQlEngine) { };

    async getUserProfile(req: RawQlRequest): Promise<RawQlResponse<number | UserEntity>> {
        if (["create", "update", "delete"].includes(req.type)) {
            throw new Error("You are not allowed to perform these actions");
        }

        return await this.engine.execute(req);
    }

    async updateProfile(user: Partial<UserEntity>): Promise<RawQlResponse<UserEntity>> {
        return await this.engine.execute({
            entity: "User",
            type: "update",
            id: user._id,
            data: user,
        }) as RawQlResponse<UserEntity>
    }
}
