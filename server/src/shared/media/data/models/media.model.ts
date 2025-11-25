
import { Schema, Types } from "mongoose";
import MediaEntity from "../../domain/entities/media.entity";

const mediaSchema = new Schema<MediaEntity>({
    path: { type: String, required: true },
    local: { type: Boolean, default: true },
    mimeType: { type: String, required: true },
    ref_code: { type: String, default: null },
    ref_id: { type: Types.ObjectId, required: true },
}, {
    timestamps: true,
})

mediaSchema.pre('save', function (next) {
    if (this?.path.startsWith("https://") || this?.path.startsWith("http://")) {
        this.local = false;
    }

    next();
});

export default mediaSchema;
