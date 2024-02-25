const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 8000;

// Use cors middleware
app.use(cors());

// Define MongoDB schema
const videoSchema = new mongoose.Schema({
  videoId: String,
  type: String,
  url: String,
  title: String,
  channelName: String,
  channelUrl: String,
  views: Number,
  length: String,
  category: String
});

const Video = mongoose.model('Video', videoSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://umesh:umesh@youtubeshorts.3plwuct.mongodb.net/?appName=youtubeshorts/youtube');

// GET API with pagination
app.get('/youtube-shorts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1
    const limit = parseInt(req.query.limit) || 10; // Number of documents per page, default to 10

    const skip = (page - 1) * limit;

    const shorts = await Video.find({ type: 'SHORTS' })
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(await Video.countDocuments({ type: 'SHORTS' }) / limit),
      shorts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
