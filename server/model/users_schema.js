import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    profilePicture: {
        type: String, // URL or file path
        default: "default-profile.png"
    },
    bio: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const User = mongoose.model("User", userSchema);

export default User;