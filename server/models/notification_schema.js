import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    to_username: {
        type: mongoose.Schema.ObjectId,
        ref: "User", 
        required: true
    },
    from_username: {
        type: String,
        trim: true
    },
    from_username_avatar_url: {
        type: String
    },
    body: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true }); 

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
