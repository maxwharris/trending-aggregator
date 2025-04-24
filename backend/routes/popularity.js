const express = require('express');
const router = express.Router();
const TopicPopularity = require('../models/TopicPopularity');

router.get('/', async (req, res) => {
  const { topic, source } = req.query;

  try {
    const data = await TopicPopularity.find({ topic, source }).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popularity data' });
  }
});

module.exports = router;
