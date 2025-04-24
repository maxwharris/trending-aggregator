const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  topic: String,
  source: String,
  title: String,
  link: String,
  summary: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Topic', TopicSchema);
