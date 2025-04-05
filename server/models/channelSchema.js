import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: [true, "Channel name already exists"],
        trim: true
    },

    channelDescription: {
        type: String,
        required: true,
        trim: true
    },

    channelCategory: {
        type: String,
        enum: ["Kids","Student","Public"],
        default: 'Public',
        required: [true, "Channel category is required"]
    },

    channelLogo: {
        type: String,
        default: process.env.DEFAULT_USER_IMG
    },

    channelAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    channelMembers: [{
        username: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
            default: process.env.DEFAULT_USER_IMG
        }
    }],
    
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
    }]
},{timestamps:true});

export default mongoose.model("Channel", channelSchema);
