import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      unique: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

const log = mongoose.model('Message', activityLogSchema);

module.exports = log;