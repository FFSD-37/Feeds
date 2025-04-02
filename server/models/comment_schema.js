import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String, // Can be a URL or file path
        default: process.env.DEFAULT_USER_IMG
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });  // Automatically adds `createdAt` and `updatedAt`

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
