import mongoose from "mongoose";

const kidsPostSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true // auto-generate ObjectId
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    likes: {
        type: [String], // array of usernames or user ids who liked the post
        default: []
    },
    type: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true }); // adds createdAt & updatedAt fields

const KidsPost = mongoose.model("KidsPost", kidsPostSchema);

export default KidsPost;
