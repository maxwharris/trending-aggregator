const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

router.get('/', async (req, res) => {
  const { keyword, timeRange } = req.query;
  const timeRanges = {
    hour: 1,
    day: 24,
    week: 168,
  };
  const hours = timeRanges[timeRange] || 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  try {
    const topics = await Topic.find({
      topic: { $regex: keyword, $options: 'i' },
      createdAt: { $gte: since },
    }).sort({ popularityScore: -1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
