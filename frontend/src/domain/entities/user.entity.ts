import MediaEntity from "./media.entity";

export default interface UserEntity {
    _id?: string;
    name?: string;
    username: string;
    dateOfBirth: Date;
    password: string;
    authTokens: string[];
    profilePicture?: MediaEntity;
    authToken?: string;
    createdAt: Date;
    updatedAt: Date;
}
