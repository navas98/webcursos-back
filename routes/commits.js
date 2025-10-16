const express = require("express");
const router = express.Router();
const Commit = require("../models/Commit");
const Video = require("../models/video");

// ✅ GET all commits
router.get("/", async (req, res) => {
  try {
    const commits = await Commit.find().populate("video");
    res.json(commits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET commits for a specific video
router.get("/video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const commits = await Commit.find({ video: videoId }).populate("video");
    if (!commits.length)
      return res.status(404).json({ message: "No commits found for this video" });
    res.json(commits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET one commit by ID
router.get("/:id", async (req, res) => {
  try {
    const commit = await Commit.findById(req.params.id).populate("video");
    if (!commit) return res.status(404).json({ message: "Commit not found" });
    res.json(commit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST create new commit
router.post("/", async (req, res) => {
  try {
    const { commit_id, message, user, video } = req.body;

    if (!commit_id || !user || !video)
      return res.status(400).json({ message: "commit_id, user and video are required" });

    const newCommit = new Commit({ commit_id, message, user, video });
    const savedCommit = await newCommit.save();

    // optional: link the commit to the video
    await Video.findByIdAndUpdate(video, { commit: savedCommit._id });

    res.status(201).json(savedCommit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT update commit
router.put("/:id", async (req, res) => {
  try {
    const updatedCommit = await Commit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCommit)
      return res.status(404).json({ message: "Commit not found" });
    res.json(updatedCommit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE commit
router.delete("/:id", async (req, res) => {
  try {
    const deletedCommit = await Commit.findByIdAndDelete(req.params.id);
    if (!deletedCommit)
      return res.status(404).json({ message: "Commit not found" });
    res.json({ message: "Commit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
