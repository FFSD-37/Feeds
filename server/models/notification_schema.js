import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    msgSerial: {
        type: Integer,
        required: true
    },
    userInvolved: {
        type: String,
        required: true
    },
    coin: {
        type: Integer,
        required: true
    }
}, { timestamps: true }); 

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
