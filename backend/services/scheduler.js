const cron = require('node-cron');
const mongoose = require('mongoose');
const fetchNews = require('../fetchers/newsFetcher');
const fetchReddit = require('../fetchers/redditFetcher');
const fetchTwitter = require('../fetchers/twitterFetcher');
const calculatePopularity = require('../utils/calculatePopularity');
const detectSpike = require('../utils/spikeDetector');
const sendSpikeAlertEmail = require('../utils/emailAlert');
const Topic = require('../models/Topic');
const TopicPopularity = require('../models/TopicPopularity');

class SchedulerService {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.nextRun = null;
  }

  // Clean up data older than 7 days
  async cleanupOldData() {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      console.log(`🧹 Cleaning up data older than ${oneWeekAgo.toISOString()}`);
      
      // Remove old topics
      const topicsDeleted = await Topic.deleteMany({
        createdAt: { $lt: oneWeekAgo }
      });
      
      // Remove old popularity entries
      const popularityDeleted = await TopicPopularity.deleteMany({
        timestamp: { $lt: oneWeekAgo }
      });
      
      console.log(`✅ Cleanup complete: ${topicsDeleted.deletedCount} topics, ${popularityDeleted.deletedCount} popularity entries removed`);
    } catch (error) {
      console.error('❌ Error during cleanup:', error.message);
    }
  }

  // Main data fetching function
  async fetchAllData() {
    if (this.isRunning) {
      console.log('⏳ Data fetch already in progress, skipping...');
      return;
    }

    try {
      this.isRunning = true;
      this.lastRun = new Date();
      
      console.log(`🚀 Starting automated data fetch at ${this.lastRun.toISOString()}`);

      // Clean up old data first
      await this.cleanupOldData();

      // Fetch data from all sources
      const [newsData, redditData, twitterData] = await Promise.all([
        fetchNews().catch(err => {
          console.error('❌ News fetch error:', err.message);
          return [];
        }),
        fetchReddit().catch(err => {
          console.error('❌ Reddit fetch error:', err.message);
          return [];
        }),
        fetchTwitter().catch(err => {
          console.error('❌ Twitter fetch error:', err.message);
          return [];
        }),
      ]);

      const allData = [...newsData, ...redditData, ...twitterData];
      console.log(`📊 Fetched ${allData.length} items (News: ${newsData.length}, Reddit: ${redditData.length}, Twitter: ${twitterData.length})`);

      let processedCount = 0;
      let errorCount = 0;

      // Process each item
      for (const item of allData) {
        try {
          const metrics = {
            likes: item.likes || 0,
            retweets: item.retweets || 0,
            replies: item.replies || 0,
            upvotes: item.upvotes || 0,
            comments: item.comments || 0,
            views: item.views || 0,
            shares: item.shares || 0,
            upvoteRatio: item.upvoteRatio || 0.5,
            score: item.score || 0,
          };

          const popularityScore = calculatePopularity(metrics, item.createdAt || item.publishedAt, item.source);

          // Check if topic already exists to avoid duplicates
          const existingTopic = await Topic.findOne({
            title: item.title,
            source: item.source,
            link: item.link
          });

          if (!existingTopic) {
            const topicEntry = new Topic({
              topic: item.topic,
              source: item.source,
              title: item.title,
              link: item.link,
              summary: item.summary || '',
              publishedAt: item.publishedAt || item.createdAt,
              imageUrl: item.imageUrl || null, // Add image support
              metrics: metrics,
              popularityScore: popularityScore // Store calculated popularity
            });

            await topicEntry.save();
            processedCount++;
          }

          const popularityEntry = new TopicPopularity({
            topic: item.topic,
            source: item.source,
            popularityScore,
          });

          await popularityEntry.save();

          // Spike detection
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

        } catch (itemError) {
          console.error(`❌ Error processing item "${item.title}":`, itemError.message);
          errorCount++;
        }
      }

      console.log(`✅ Data fetch complete: ${processedCount} new items processed, ${errorCount} errors`);
      
    } catch (error) {
      console.error('❌ Error in automated data fetch:', error.message);
    } finally {
      this.isRunning = false;
      // Calculate next run time (30 minutes from now)
      this.nextRun = new Date(Date.now() + 30 * 60 * 1000);
      console.log(`⏰ Next automated fetch scheduled for: ${this.nextRun.toISOString()}`);
    }
  }

  // Start the scheduler
  start() {
    console.log('🕐 Starting automated data fetching scheduler (every 30 minutes)');
    
    // Run immediately on start
    this.fetchAllData();
    
    // Schedule to run every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      this.fetchAllData();
    });

    // Also run cleanup daily at 2 AM
    cron.schedule('0 2 * * *', () => {
      this.cleanupOldData();
    });

    console.log('✅ Scheduler started successfully');
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      uptime: process.uptime()
    };
  }

  // Manual trigger for testing
  async triggerManualFetch() {
    console.log('🔧 Manual data fetch triggered');
    await this.fetchAllData();
  }
}

module.exports = new SchedulerService();
