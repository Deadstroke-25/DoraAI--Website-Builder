import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"]
    },

    avatar: {
        type: String,
        default: ""
    },

    credits: {
        type: Number,
        default: 100,
        min: 0
    },

    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
    }
},
{
    timestamps: true
});

export const User = mongoose.model("User", userSchema);