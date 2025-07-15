const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  topic: String,
  source: String,
  title: String,
  link: String,
  summary: String,
  publishedAt: Date,
  imageUrl: String, // Add image support
  metrics: {
    likes: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    upvoteRatio: { type: Number, default: 0.5 },
    score: { type: Number, default: 0 }
  },
  popularityScore: { type: Number, default: 0 }, // Store calculated popularity
  createdAt: { type: Date, default: Date.now },
});

// Index for efficient querying
TopicSchema.index({ topic: 1, source: 1 });
TopicSchema.index({ popularityScore: -1 });
TopicSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Topic', TopicSchema);
