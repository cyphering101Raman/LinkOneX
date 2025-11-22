import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        gender: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },

        mood: {
            type: String,
            default: null,        // user selects after login
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
        lastActive: {
            type: Date,
            default: null,
        },
        currentChatId: {
            type: String,
            default: null,        // redis chat session id
        },
    },
    { timestamps: true }
);

// hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

// password compare method
UserSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
