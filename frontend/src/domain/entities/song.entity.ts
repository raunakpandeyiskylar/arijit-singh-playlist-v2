import MediaEntity from "./media.entity";
import UserEntity from "./user.entity";

export default interface SongEntity {
    _id?: string;
    name: string;
    artists: string[];
    cover?: MediaEntity;
    song: MediaEntity | string;
    createdBy: UserEntity;
    createdAt: Date;
    updateAt: Date;
}
