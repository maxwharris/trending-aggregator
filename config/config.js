require('dotenv').config();
const interests = require('./interests.json');

module.exports = {
  // News API configuration
  newsApiKey: process.env.NEWS_API_KEY,
  
  // Reddit API configuration
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    userAgent: process.env.REDDIT_USER_AGENT
  },
  
  // Twitter API configuration
  twitter: {
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
  },
  
  // Email configuration
  email: {
    user: process.env.ALERT_EMAIL_USER,
    password: process.env.ALERT_EMAIL_PASS,
    receiver: process.env.ALERT_EMAIL_RECEIVER
  },
  
  // Interest tags from JSON file
  interestTags: interests
};
