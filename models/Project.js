const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    created_at: { type: Date, default: Date.now }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate: get all videos linked to this project
ProjectSchema.virtual("videos", {
  ref: "Video",
  localField: "_id",
  foreignField: "project"
});

module.exports = mongoose.model("Project", ProjectSchema);
