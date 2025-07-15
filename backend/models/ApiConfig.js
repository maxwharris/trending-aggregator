const mongoose = require('mongoose');

const apiConfigSchema = new mongoose.Schema({
  apiName: {
    type: String,
    required: true,
    unique: true,
    enum: ['reddit', 'news', 'twitter']
  },
  enabled: {
    type: Boolean,
    default: true
  },
  settings: {
    // Reddit-specific settings
    rateLimit: {
      type: Number,
      default: 60
    },
    postsPerSubreddit: {
      type: Number,
      default: 5
    },
    // News API settings
    articlesPerTopic: {
      type: Number,
      default: 10
    },
    sources: [{
      type: String
    }],
    // Twitter settings
    tweetsPerTopic: {
      type: Number,
      default: 10
    }
  },
  credentials: {
    clientId: String,
    clientSecret: String,
    username: String,
    password: String,
    apiKey: String,
    accessToken: String,
    accessSecret: String,
    userAgent: String
  },
  status: {
    lastTested: Date,
    isWorking: {
      type: Boolean,
      default: false
    },
    lastError: String,
    errorCount: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

apiConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ApiConfig', apiConfigSchema);
