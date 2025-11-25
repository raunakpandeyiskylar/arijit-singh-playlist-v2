import { Schema, Types } from "mongoose";
import PlaylistEntity from "../../domain/entities/playlist.entity";

const playlistSchema = new Schema<PlaylistEntity>({
    name: { type: String, default: null },
    for: { type: Types.ObjectId, ref: "User", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    mode: { type: String, enum: ["shuffle", "normal", "repeat"], default: "normal" },
    songs: [{
        type: Types.ObjectId,
        ref: "Song",
    }],
}, { timestamps: true })

export default playlistSchema;
