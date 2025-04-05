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
        unique: [true, "Username already exists"],
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
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

    visibility: {
        type: String,
        enum: ["Public", "Private"],
        default: "Public"
    },

    profilePicture: {
        type: String,
        default: process.env.DEFAULT_USER_IMG
    },

    followers: [{
        username:{
            type:String
        },
        avatarUrl:{
            type:String
        }
    }],

    followings: [{
        username:{
            type:String
        },
        avatarUrl:{
            type:String
        }
    }],

    bio: {
        type: String,
        trim: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },

    termsAccepted: {
        type: Boolean,
        default: false
    },

    isPremium: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        enum: ["Kids","Student","Normal", "Admin"],
        default:'Normal'
    },

    savedPostsIds: [{
        type: String
    }],

    likedPostsIds: [{
        type: String
    }],

    archivedPostsIds: [{
        type: String
    }],
    
    postIds:[{
        type: String
    }],

    channelName:[{
        type: String
    }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;