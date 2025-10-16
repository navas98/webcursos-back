const express = require("express");
const router = express.Router();
const axios = require("axios");
const Video = require("../models/video");
const dotenv = require("dotenv");
dotenv.config();

// ✅ GET all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate("project").populate("commit");
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET one video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("project").populate("commit");
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST create video manually
router.post("/", async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT update video
router.put("/:id", async (req, res) => {
  try {
    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Video not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE video
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ⚡ GET video info from YouTube API and save it
router.post("/youtube/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const { project } = req.body; // optional: associate with project
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
    );

    if (!response.data.items.length)
      return res.status(404).json({ message: "Video not found on YouTube" });

    const videoData = response.data.items[0];
    const { snippet, statistics, contentDetails } = videoData;

    const newVideo = new Video({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: snippet.title,
      description: snippet.description,
      publish_date: snippet.publishedAt,
      thumbnail: snippet.thumbnails.high?.url,
      views: parseInt(statistics.viewCount || 0),
      likes: parseInt(statistics.likeCount || 0),
      duration: contentDetails.duration,
      project: project || null,
    });

    const saved = await newVideo.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("YouTube API error:", error.message);
    res.status(500).json({ message: "Failed to fetch data from YouTube API" });
  }
});
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const videos = await Video.find({ project: projectId })
      .populate("project")
      .populate("commit")
      .sort({ publish_date: -1 });

    if (!videos.length) {
      return res.status(404).json({ message: "No videos found for this project" });
    }

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
