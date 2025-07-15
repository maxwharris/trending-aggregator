const mongoose = require('mongoose');

const topicConfigSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
    unique: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  subreddits: [{
    name: {
      type: String,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 1
    }
  }],
  newsKeywords: [{
    type: String
  }],
  twitterKeywords: [{
    type: String
  }],
  settings: {
    maxPostsPerSource: {
      type: Number,
      default: 5
    },
    minUpvotes: {
      type: Number,
      default: 0
    },
    minComments: {
      type: Number,
      default: 0
    },
    timeRange: {
      type: String,
      enum: ['hour', 'day', 'week', 'month'],
      default: 'day'
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

topicConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get enabled subreddits for this topic
topicConfigSchema.methods.getEnabledSubreddits = function() {
  return this.subreddits
    .filter(sub => sub.enabled)
    .sort((a, b) => b.priority - a.priority)
    .map(sub => sub.name);
};

// Static method to get all enabled topics
topicConfigSchema.statics.getEnabledTopics = function() {
  return this.find({ enabled: true })
    .sort({ priority: -1 });
};

module.exports = mongoose.model('TopicConfig', topicConfigSchema);
