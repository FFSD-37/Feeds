import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      trim: true
    },
    receiver: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    timestamps: true 
  }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;