const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    publish_date: { type: Date },
    description: { type: String },
    thumbnail: { type: String },
    technologies: { type: [String] }, // e.g. ["React", "Node", "MongoDB"]
    views: { type: Number },
    likes: { type: Number },
    duration: { type: String }, // ISO 8601 format: "PT5M32S"
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // belongs to one Project
    commit: { type: mongoose.Schema.Types.ObjectId, ref: "Commit" } // one-to-one relationship
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Optional: populate commit automatically when querying a video
VideoSchema.virtual("commitData", {
  ref: "Commit",
  localField: "commit",
  foreignField: "_id",
  justOne: true
});

module.exports = mongoose.model("Video", VideoSchema);
