import { Schema, Types } from "mongoose";
import SongEntity from "../../domain/entities/song.entity";

const songSchema = new Schema<SongEntity>({
    name: { type: String, default: null },
    artists: [{
        type: String,
    }],
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

export default songSchema;
