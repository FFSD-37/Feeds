import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  post_id: {
    type: String,
    required: true
  },
  report_number: {
    type: Number
  },
  user_reported: {
    type: [String]
  },
  reasons: {
    type: [String]
  }
}, {timestamps: true});

const Report = mongoose.model('Report', reportSchema);

export default Report;