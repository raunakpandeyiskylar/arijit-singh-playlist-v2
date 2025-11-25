import { Schema, Types } from "mongoose";
import UserEntity from "../../domain/entities/user.entity";
import { hashSync } from "bcrypt";

const userSchema = new Schema<UserEntity>({
    name: { type: String, default: null },
    username: { type: String, required: true, unique: true },
    authTokens: [{ type: String }],
    dateOfBirth: { type: Date },
    password: { type: String, required: true },
}, {
    timestamps: true,
})

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = hashSync(this.password, 12);
    }

    next();
});

export default userSchema;
