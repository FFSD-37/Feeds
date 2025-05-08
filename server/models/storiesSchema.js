// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  avatarUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true 
});

const Story = mongoose.model("Story", linkSchema);

export default Story;
