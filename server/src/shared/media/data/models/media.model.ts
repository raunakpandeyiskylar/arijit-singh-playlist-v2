
import {Schema} from "mongoose";
import MediaEntity from "../../domain/entities/media.entity";

const mediaSchema = new Schema<MediaEntity>({
    path: {type: String, required: true},
    isLocal: {type: Boolean, default: true},
    mimeType: {type: String, required: true},
}, {
    timestamps: true,
})

mediaSchema.pre('save', function (next) {
    if(this?.path.startsWith("https://") || this?.path.startsWith("http://")) {
        this.isLocal = false;
    }

    next();
});

export default mediaSchema;
