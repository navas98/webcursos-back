const mongoose = require("mongoose");

const CommitSchema = new mongoose.Schema({
  commit_id: { type: String, required: true },
  message: { type: String },
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }
});

module.exports = mongoose.model("Commit", CommitSchema);
