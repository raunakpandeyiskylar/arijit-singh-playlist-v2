import MediaEntity from "../../shared/media/domain/entities/media.entity";
import UserEntity from "./user.entity";

export default interface SongEntity {
    _id?: string;
    name: string;
    artists: string[];
    cover?: MediaEntity;
    song: MediaEntity;
    createdBy: UserEntity;
    createdAt: Date;
    updateAt: Date;
}
