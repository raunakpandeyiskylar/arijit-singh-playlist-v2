import { RawQlRequest, RawQlResponse } from "raw_lib";
import UserEntity from "../entities/user.entity";

export default abstract class UserRepository {
    abstract updateProfile(user: Partial<UserEntity>): Promise<RawQlResponse<UserEntity>>;
    abstract getUserProfile(req: RawQlRequest): Promise<RawQlResponse<number | UserEntity>>;
}
