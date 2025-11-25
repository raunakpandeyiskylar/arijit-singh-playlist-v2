import SongEntity from "./song.entity";
import UserEntity from "./user.entity";

export default interface PlaylistEntity {
    _id?: string;
    name?: string;
    for: UserEntity;
    createdBy: UserEntity;
    songs: SongEntity[];
    mode: "shuffle" | "normal" | "repeat",
    createdAt: Date;
    updatedAt: Date;
}
