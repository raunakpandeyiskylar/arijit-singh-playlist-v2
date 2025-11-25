import SongEntity from "./song.entity";
import UserEntity from "./user.entity";

export default interface Jamming {
    _id?: string;
    sessionId: string;
    title: string;
    users: UserEntity[];
    createdBy: UserEntity;
    playList: SongEntity[];
    mode: "shuffle" | "normal" | "repeat";
    endAt?: Date;
    restartedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
