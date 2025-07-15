const express = require('express');
const router = express.Router();
const topicGroupingService = require('../services/topicGrouping');

// Get trending topics with grouping applied
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const trendingTopics = await topicGroupingService.getTrendingTopics(limit);
    
    res.json({
      success: true,
      count: trendingTopics.length,
      data: trendingTopics
    });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending topics'
    });
  }
});

// Get topic grouping statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await topicGroupingService.getTopicStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching topic stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch topic statistics'
    });
  }
});

module.exports = router;
