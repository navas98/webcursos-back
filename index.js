const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json()); // 👈 IMPORTANTE

const PORT = process.env.PORT || 4000;

// 🧩 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔗 Rutas
const projectsRouter = require("./routes/project");
app.use("/api/project", projectsRouter);
const videoRoutes=require("./routes/video");
app.use("/api/video",videoRoutes);
const commitRoutes=require("./routes/commits");
app.use("/api/commit",commitRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
