import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String, // Can be a URL or file path
        default: "default-avatar.png"
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });  // Automatically adds `createdAt` and `updatedAt`

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
