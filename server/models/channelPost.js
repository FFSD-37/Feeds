import mongoose from "mongoose";

const channelPostschema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    type: {
        type: String,
        enum: ['Reels', 'Img'],
        required: true
    },

    url: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: [true, 'channel is required']
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    warnings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const channelPost = mongoose.model('channelPost', channelPostschema);

export default channelPost;