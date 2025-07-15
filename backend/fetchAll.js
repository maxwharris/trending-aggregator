const mongoose = require('mongoose');
const fetchNews = require('./fetchers/newsFetcher');
const fetchReddit = require('./fetchers/redditFetcher');
const fetchTwitter = require('./fetchers/twitterFetcher');
const calculatePopularity = require('./utils/calculatePopularity');
const detectSpike = require('./utils/spikeDetector');
const sendSpikeAlertEmail = require('./utils/emailAlert');
const Topic = require('./models/Topic');
const TopicPopularity = require('./models/TopicPopularity');
require('dotenv').config();

async function fetchAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const [newsData, redditData, twitterData] = await Promise.all([
      fetchNews(),
      fetchReddit(),
      fetchTwitter(),
    ]);

    const allData = [...newsData, ...redditData, ...twitterData];

    for (const item of allData) {
      const metrics = {
        likes: item.likes || 0,
        retweets: item.retweets || 0,
        replies: item.replies || 0,
        upvotes: item.upvotes || 0,
        comments: item.comments || 0,
        upvoteRatio: item.upvoteRatio || 0.5,
        score: item.score || 0,
      };

      const popularityScore = calculatePopularity(metrics, item.createdAt || item.publishedAt, item.source);

      const topicEntry = new Topic({
        topic: item.topic,
        source: item.source,
        title: item.title,
        link: item.link,
        summary: item.summary || '',
        publishedAt: item.publishedAt || item.createdAt,
      });

      await topicEntry.save();

      const popularityEntry = new TopicPopularity({
        topic: item.topic,
        source: item.source,
        popularityScore,
      });

      await popularityEntry.save();

      // Retrieve recent popularity scores for spike detection
      const recentEntries = await TopicPopularity.find({
        topic: item.topic,
        source: item.source,
      })
        .sort({ timestamp: -1 })
        .limit(5);

      const timestamps = recentEntries.map(entry => ({
        timestamp: entry.timestamp,
        score: entry.popularityScore,
      }));

      const spikeInfo = detectSpike(timestamps, popularityScore);

      if (spikeInfo.isSpike) {
        await sendSpikeAlertEmail(item, spikeInfo);
      }
    }

    console.log('Data fetching and processing complete.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error in fetchAll:', error.message);
    mongoose.connection.close();
  }
}

fetchAll();
