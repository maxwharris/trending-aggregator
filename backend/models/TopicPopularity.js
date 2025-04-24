const mongoose = require('mongoose');

const TopicPopularitySchema = new mongoose.Schema({
  topic: String,
  source: String,
  timestamp: { type: Date, default: Date.now },
  popularityScore: Number,
});

module.exports = mongoose.model('TopicPopularity', TopicPopularitySchema);
