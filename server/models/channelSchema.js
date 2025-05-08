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
        type: [String],
        required: true,
        validate: {
            validator: function(categories) {
                const validOptions = ["Education","Kids","Student","Public","Games"];
                return categories.every(cat => validOptions.includes(cat));
            },
            message: "Invalid category found in the list"
        }
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