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
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Link', linkSchema);
