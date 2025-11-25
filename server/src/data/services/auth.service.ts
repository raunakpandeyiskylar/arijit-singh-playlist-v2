import { RawQlEngine, RawQlResponse } from "raw_lib";
import AuthRepository from "../../domain/repositories/auth.repository";
import UserEntity from "../../domain/entities/user.entity";
import envConfig from "../../config/env.config";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export default class AuthServices implements AuthRepository {
    constructor(private engine: RawQlEngine) { };

    async login({ username, password }: { username: string; password: string }): Promise<RawQlResponse<UserEntity>> {
        try {
            const response = await this.engine.execute<UserEntity>({ entity: "User", type: "get", filter: { field: "username", op: "eq", value: username } });
            let user = response.data?.type === "single" ? response.data?.item as UserEntity : response.data?.items[0] as UserEntity;

            if (!user) {
                return {
                    status: false,
                    message: "Please signup to get started",
                    data: null,
                }
            }

            const isMatched = await compare(password, user.password);

            if (!isMatched) {
                return {
                    status: false,
                    message: "Please enter a correct password",
                    data: null,
                }
            }

            const token = sign({ _id: user._id }, envConfig.secret);

            user.authTokens.push(token);

            let updates = await this.engine.execute<UserEntity>({ entity: "User", type: "update", id: user._id, data: user, options: { limit: 1, select: ["name", "username"] } });
            user = updates.data?.type === "single" ? updates.data?.item as UserEntity : updates.data?.items[0] as UserEntity;

            return {
                status: true,
                message: `Welcome back ${user?.name || user.username}`,
                data: { type: "single", item: { ...user, authToken: token } },
            }
        } catch (e: any) {
            return {
                status: false,
                message: e.message,
                data: null,
            }
        }
    }

    async signup(user: UserEntity): Promise<RawQlResponse<UserEntity | number>> {
        try {
            return await this.engine.execute<UserEntity>({
                type: "create",
                entity: "User",
                data: user,
            });
        } catch (e: any) {
            return {
                status: false,
                message: e.message,
                data: null,
            }
        }
    }

    async logout(token: string, user: UserEntity): Promise<RawQlResponse<null>> {
        try {
            await this.engine.execute<UserEntity>({ entity: "User", type: "update", id: user._id, data: { authTokens: user.authTokens.filter((t) => token !== t) } })

            return {
                status: true,
                message: `See you soon ${user?.name || user.username}!`,
                data: null,
            }
        } catch (e: any) {
            return {
                status: false,
                message: e.message,
                data: null
            }
        }
    }
}
