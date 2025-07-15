const express = require('express');
const router = express.Router();
const ApiConfig = require('../models/ApiConfig');
const TopicConfig = require('../models/TopicConfig');
const axios = require('axios');

// Get all API configurations
router.get('/apis', async (req, res) => {
  try {
    const apiConfigs = await ApiConfig.find({});
    res.json(apiConfigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API configurations' });
  }
});

// Update API configuration
router.post('/apis/:apiName', async (req, res) => {
  try {
    const { apiName } = req.params;
    const updateData = req.body;

    const apiConfig = await ApiConfig.findOneAndUpdate(
      { apiName },
      updateData,
      { new: true, upsert: true }
    );

    res.json(apiConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update API configuration' });
  }
});

// Test API connection
router.post('/apis/:apiName/test', async (req, res) => {
  try {
    const { apiName } = req.params;
    const apiConfig = await ApiConfig.findOne({ apiName });

    if (!apiConfig) {
      return res.status(404).json({ error: 'API configuration not found' });
    }

    let testResult = { isWorking: false, error: null };

    switch (apiName) {
      case 'reddit':
        testResult = await testRedditConnection(apiConfig);
        break;
      case 'news':
        testResult = await testNewsConnection(apiConfig);
        break;
      case 'twitter':
        testResult = await testTwitterConnection(apiConfig);
        break;
      default:
        return res.status(400).json({ error: 'Unknown API' });
    }

    // Update the API config with test results
    apiConfig.status.lastTested = new Date();
    apiConfig.status.isWorking = testResult.isWorking;
    apiConfig.status.lastError = testResult.error;
    if (!testResult.isWorking) {
      apiConfig.status.errorCount += 1;
    } else {
      apiConfig.status.errorCount = 0;
    }
    await apiConfig.save();

    res.json(testResult);
  } catch (error) {
    res.status(500).json({ error: 'Failed to test API connection' });
  }
});

// Get all topic configurations
router.get('/topics', async (req, res) => {
  try {
    const topicConfigs = await TopicConfig.find({}).sort({ priority: -1 });
    res.json(topicConfigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topic configurations' });
  }
});

// Create or update topic configuration
router.post('/topics/:topicName', async (req, res) => {
  try {
    const { topicName } = req.params;
    const updateData = req.body;

    const topicConfig = await TopicConfig.findOneAndUpdate(
      { topicName },
      updateData,
      { new: true, upsert: true }
    );

    res.json(topicConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic configuration' });
  }
});

// Delete topic configuration
router.delete('/topics/:topicName', async (req, res) => {
  try {
    const { topicName } = req.params;
    await TopicConfig.findOneAndDelete({ topicName });
    res.json({ message: 'Topic configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic configuration' });
  }
});

// Initialize default configurations
router.post('/initialize', async (req, res) => {
  try {
    await initializeDefaultConfigs();
    res.json({ message: 'Default configurations initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize configurations' });
  }
});

// Helper functions for testing API connections
async function testRedditConnection(apiConfig) {
  try {
    const { clientId, clientSecret, username, password, userAgent } = apiConfig.credentials;
    
    if (!clientId || !clientSecret || !username || !password) {
      return { isWorking: false, error: 'Missing Reddit credentials' };
    }

    const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await axios.post(tokenUrl, 'grant_type=password&username=' + username + '&password=' + password, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent || 'trending-aggregator:v1.0.0'
      },
      timeout: 10000
    });

    return { isWorking: true, error: null };
  } catch (error) {
    return { 
      isWorking: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

async function testNewsConnection(apiConfig) {
  try {
    const { apiKey } = apiConfig.credentials;
    
    if (!apiKey) {
      return { isWorking: false, error: 'Missing News API key' };
    }

    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${apiKey}`, {
      timeout: 10000
    });

    return { isWorking: true, error: null };
  } catch (error) {
    return { 
      isWorking: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

async function testTwitterConnection(apiConfig) {
  // Twitter API testing would go here
  // For now, return a placeholder
  return { 
    isWorking: false, 
    error: 'Twitter API testing not implemented yet' 
  };
}

// Initialize default configurations
async function initializeDefaultConfigs() {
  // Initialize default API configs
  const defaultApis = [
    {
      apiName: 'reddit',
      enabled: true,
      settings: {
        rateLimit: 60,
        postsPerSubreddit: 5
      }
    },
    {
      apiName: 'news',
      enabled: true,
      settings: {
        articlesPerTopic: 10
      }
    },
    {
      apiName: 'twitter',
      enabled: false,
      settings: {
        tweetsPerTopic: 10
      }
    }
  ];

  for (const apiConfig of defaultApis) {
    await ApiConfig.findOneAndUpdate(
      { apiName: apiConfig.apiName },
      apiConfig,
      { upsert: true }
    );
  }

  // Initialize default topic configs
  const defaultTopics = [
    {
      topicName: 'technology',
      enabled: true,
      priority: 1,
      subreddits: [
        { name: 'technology', enabled: true, priority: 1 },
        { name: 'programming', enabled: true, priority: 2 },
        { name: 'gadgets', enabled: true, priority: 3 }
      ],
      newsKeywords: ['technology', 'tech', 'software', 'AI', 'artificial intelligence']
    },
    {
      topicName: 'science',
      enabled: true,
      priority: 2,
      subreddits: [
        { name: 'science', enabled: true, priority: 1 },
        { name: 'askscience', enabled: true, priority: 2 },
        { name: 'space', enabled: true, priority: 3 }
      ],
      newsKeywords: ['science', 'research', 'discovery', 'study']
    },
    {
      topicName: 'health',
      enabled: true,
      priority: 3,
      subreddits: [
        { name: 'health', enabled: true, priority: 1 },
        { name: 'fitness', enabled: true, priority: 2 },
        { name: 'nutrition', enabled: true, priority: 3 }
      ],
      newsKeywords: ['health', 'medical', 'fitness', 'nutrition']
    },
    {
      topicName: 'sports',
      enabled: true,
      priority: 4,
      subreddits: [
        { name: 'sports', enabled: true, priority: 1 },
        { name: 'nfl', enabled: true, priority: 2 },
        { name: 'nba', enabled: true, priority: 3 },
        { name: 'soccer', enabled: true, priority: 4 }
      ],
      newsKeywords: ['sports', 'football', 'basketball', 'soccer']
    },
    {
      topicName: 'entertainment',
      enabled: true,
      priority: 5,
      subreddits: [
        { name: 'movies', enabled: true, priority: 1 },
        { name: 'television', enabled: true, priority: 2 },
        { name: 'music', enabled: true, priority: 3 }
      ],
      newsKeywords: ['entertainment', 'movies', 'music', 'celebrity']
    }
  ];

  for (const topicConfig of defaultTopics) {
    await TopicConfig.findOneAndUpdate(
      { topicName: topicConfig.topicName },
      topicConfig,
      { upsert: true }
    );
  }
}

module.exports = router;
