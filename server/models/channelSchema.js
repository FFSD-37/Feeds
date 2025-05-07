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

    archivedPostsIds: [{
        type: String
    }],
    
    postIds:[{
        type: String
    }]
},{timestamps:true});

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;