import { RawQlResponse } from "raw_lib";
import UserEntity from "../entities/user.entity";

export default abstract class AuthRepository {
    abstract login({ username, password }: { username: string, password: string }): Promise<RawQlResponse<UserEntity>>;
    abstract signup(user: UserEntity): Promise<RawQlResponse<UserEntity | number>>;
    abstract logout(token: string, user: UserEntity): Promise<RawQlResponse<null>>;
}
