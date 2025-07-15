# 🔥 Trending Aggregator

> **An intelligent, automated trending topics aggregator with smart topic grouping and real-time analytics**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Required-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Automated](https://img.shields.io/badge/Automated-Every%2030min-brightgreen.svg)](https://github.com/maxwharris/trending-aggregator)

## 🚀 Overview

Trending Aggregator is a **fully automated**, intelligent system that monitors trending topics across multiple platforms (News API, Reddit, Twitter) with advanced features like **topic grouping**, **similarity detection**, and **automated data curation**. It runs continuously, fetching data every 30 minutes and providing a beautiful, modern dashboard for trend analysis.

## ✨ Key Features

### 🤖 **Automated Intelligence**
- **🕐 Automated Data Fetching** - Runs every 30 minutes automatically using cron scheduler
- **🧹 Smart Data Cleanup** - Automatically removes articles older than 7 days
- **🔗 Topic Grouping** - Intelligently groups similar articles using similarity detection
- **📊 Enhanced Popularity Scoring** - Pure engagement-based scoring (upvotes, likes, comments, shares)

### 🎨 **Modern User Experience**
- **🖼️ Image Integration** - Displays article images from news sources
- **📱 Enhanced Dashboard** - Modern card-based UI with grouped topics
- **🔄 Real-time Updates** - Auto-refresh every 30 minutes
- **📈 Rich Analytics** - Interactive charts and engagement metrics

### 🔧 **Advanced Features**
- **🎯 Multi-source Aggregation** - News API, Reddit, Twitter integration
- **🚨 Spike Detection** - Identifies viral trends and sudden popularity increases
- **📧 Email Alerts** - Automated notifications for trending spikes
- **🔍 Smart Search** - Search across all aggregated content
- **⚙️ Configuration Management** - Web-based settings interface

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- Node-cron for automation
- Twitter API v2, Reddit API, News API

**Frontend:**
- React 19 with modern hooks
- Chart.js for data visualization
- Modern CSS with responsive design
- Axios for API communication

**Automation:**
- Automated scheduling system
- Topic similarity detection
- Data cleanup services
- Real-time analytics

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- API Keys for:
  - [News API](https://newsapi.org/) ✅ **Required**
  - [Reddit API](https://www.reddit.com/dev/api/) ✅ **Required**
  - [Twitter API](https://developer.twitter.com/) ⚠️ **Optional**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/maxwharris/trending-aggregator.git
cd trending-aggregator
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Configure Environment
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/trending-aggregator

# News API (Required)
NEWS_API_KEY=your_newsapi_key_here

# Reddit API (Required)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=trending-aggregator:v1.0.0 (by /u/yourusername)

# Twitter API (Optional - for enhanced coverage)
TWITTER_APP_KEY=your_twitter_app_key
TWITTER_APP_SECRET=your_twitter_app_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Email Alerts (Optional)
ALERT_EMAIL_USER=your_email@gmail.com
ALERT_EMAIL_PASS=your_app_password
ALERT_EMAIL_RECEIVER=alerts@yourdomain.com
```

### 4. Start the Application
```bash
# Start the automated system (recommended)
npm start

# The system will automatically:
# ✅ Start the backend server on port 4000
# ✅ Begin automated data fetching every 30 minutes
# ✅ Clean up old data automatically
# ✅ Group similar topics intelligently
```

### 5. Access the Dashboard
```bash
# Frontend runs on port 3000
# Open: http://localhost:3000

# Backend API runs on port 4000
# API Base: http://localhost:4000/api
```

## 📊 API Endpoints

### **Core Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trending` | GET | **NEW** - Get intelligently grouped trending topics |
| `/api/trending/stats` | GET | **NEW** - Get topic grouping statistics |
| `/api/search` | GET | Search topics with filters |
| `/api/popularity` | GET | Get popularity data for topics |

### **Automation Endpoints**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scheduler/status` | GET | **NEW** - Get automated scheduler status |
| `/api/scheduler/trigger` | POST | **NEW** - Manually trigger data fetch |

### **Example Usage**
```bash
# Get grouped trending topics (NEW!)
GET /api/trending?limit=20

# Get topic grouping statistics
GET /api/trending/stats

# Check automation status
GET /api/scheduler/status

# Search for technology topics from the last day
GET /api/search?keyword=technology&timeRange=day

# Get popularity data for a specific topic
GET /api/popularity?topic=technology&source=news
```

## 🏗️ Project Structure

```
trending-aggregator/
├── backend/
│   ├── Index.js                    # Main server with automation
│   ├── services/                   # NEW - Automation services
│   │   ├── scheduler.js           # Automated data fetching
│   │   └── topicGrouping.js       # Topic similarity & grouping
│   ├── fetchers/                   # API data fetchers
│   │   ├── newsFetcher.js         # Enhanced with image support
│   │   ├── redditFetcher.js       # Reddit API integration
│   │   └── twitterFetcher.js      # Twitter API integration
│   ├── models/                     # Enhanced MongoDB schemas
│   │   ├── Topic.js               # Enhanced with metrics & images
│   │   ├── TopicPopularity.js     # Popularity tracking
│   │   ├── ApiConfig.js           # API configuration management
│   │   └── TopicConfig.js         # Topic configuration
│   ├── routes/                     # API routes
│   │   ├── trending.js            # NEW - Grouped trending topics
│   │   ├── search.js              # Enhanced search
│   │   ├── popularity.js          # Popularity analytics
│   │   └── config.js              # Configuration management
│   └── utils/                      # Utility functions
│       ├── calculatePopularity.js # Enhanced engagement scoring
│       ├── spikeDetector.js       # Viral trend detection
│       └── emailAlert.js          # Automated notifications
├── frontend/
│   ├── src/
│   │   ├── components/             # Enhanced React components
│   │   │   ├── Dashboard.jsx      # NEW - Enhanced with grouping
│   │   │   ├── SearchPage.jsx     # Improved search interface
│   │   │   ├── SettingsPage.jsx   # Configuration management
│   │   │   ├── TopicChart.jsx     # Data visualization
│   │   │   └── Navbar.jsx         # Navigation
│   │   ├── styles.css             # Enhanced modern styling
│   │   ├── App.jsx                # Main React app
│   │   └── index.js               # Entry point
│   └── public/
├── config/
│   ├── config.js                   # Enhanced configuration
│   └── interests.json              # Monitored topics
└── .env                           # Environment variables
```

## 🎯 Monitored Topics

The system automatically tracks these topics with intelligent grouping:

**Default Topics:**
- 🔬 **Technology** - AI, software, hardware, startups
- 🧪 **Science** - Research, discoveries, breakthroughs
- 🏥 **Health** - Medical news, wellness, healthcare
- ⚽ **Sports** - Games, scores, athlete news
- 🎬 **Entertainment** - Movies, music, celebrities
- 💼 **Business** - Markets, companies, economy
- 🏛️ **Politics** - Elections, policies, government
- 🎓 **Education** - Schools, learning, academic news
- 🌍 **Environment** - Climate, sustainability, nature
- ✈️ **Travel** - Destinations, tourism, transportation

*Topics can be customized in `config/interests.json`*

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | **Start automated system** (backend + scheduler) |
| `npm run client` | Start frontend development server |
| `npm run dev` | Start both backend and frontend |
| `npm run fetch` | Manual data collection (legacy) |
| `npm run test-config` | Test API configuration |

## 🎨 Dashboard Features

### **Enhanced Topic Cards**
- 🖼️ **Article Images** - Visual thumbnails from news sources
- 📊 **Engagement Metrics** - Upvotes, likes, comments, shares
- 🔗 **Related Articles** - Grouped similar articles (e.g., "11 articles")
- 🌐 **Multi-source Badges** - Shows coverage across platforms
- 🔥 **Combined Popularity Scores** - Aggregated engagement scoring

### **Smart Grouping Example**
```
🔥 "Republicans block vote to release Epstein files"
   📰 11 articles  🔗 2 sources  🔥 145,412 popularity

   Related Articles (10):
   • "211 House Republicans Vote to Block Epstein Files" (Reddit - 🔥 41,653)
   • "House GOP blocks Dem maneuver to force release..." (Reddit - 🔥 28,533)
   • "House Republicans Block Release of Epstein Files" (News - 🔥 15,234)
   + 7 more articles
```

## 🚨 Troubleshooting

### **Common Issues**

**MongoDB Connection Error**
```bash
Database connection error: connect ECONNREFUSED
```
- Ensure MongoDB is running: `mongod` or use MongoDB Compass
- Update `MONGODB_URI` for cloud instances (MongoDB Atlas)

**API Rate Limits**
- News API: 1000 requests/day (free tier)
- Reddit API: 60 requests/minute
- System automatically handles rate limiting

**Scheduler Not Running**
```bash
# Check scheduler status
curl http://localhost:4000/api/scheduler/status

# Manually trigger fetch
curl -X POST http://localhost:4000/api/scheduler/trigger
```

**Frontend Not Loading**
- Ensure backend is running on port 4000
- Frontend proxy configured for API calls
- Check browser console for errors

## 🔒 Security & Best Practices

- ✅ **Environment Variables** - All sensitive data in `.env`
- ✅ **Comprehensive .gitignore** - Prevents credential leaks
- ✅ **API Rate Limiting** - Respects platform limits
- ✅ **Error Handling** - Graceful failure recovery
- ✅ **Data Validation** - Input sanitization
- ⚠️ **Production Deployment** - Use HTTPS and secure MongoDB

## 🚀 Deployment

### **Production Setup**
```bash
# Set production environment
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start backend/Index.js --name "trending-aggregator"

# Monitor logs
pm2 logs trending-aggregator
```

### **Docker Deployment** (Optional)
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly: `npm run test-config`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all APIs work correctly

## 📈 Performance & Scaling

### **Current Performance**
- ⚡ **213 articles processed** per automated run
- 🔄 **30-minute intervals** for fresh data
- 🧠 **Smart grouping** reduces noise by ~60%
- 📊 **Real-time analytics** with sub-second response

### **Scaling Considerations**
- **Database Indexing** - Optimized for popularity queries
- **Caching Layer** - Redis for frequently accessed data
- **Load Balancing** - Multiple server instances
- **CDN Integration** - For image delivery

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [News API](https://newsapi.org/) - Comprehensive news coverage
- [Reddit API](https://www.reddit.com/dev/api/) - Social media insights
- [Twitter API](https://developer.twitter.com/) - Real-time trends
- [Chart.js](https://www.chartjs.org/) - Beautiful data visualization
- [MongoDB](https://www.mongodb.com/) - Flexible data storage

## 📞 Support & Community

### **Getting Help**
- 📖 **Documentation** - Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
- 🐛 **Bug Reports** - Open an [issue](https://github.com/maxwharris/trending-aggregator/issues)
- 💡 **Feature Requests** - Use [GitHub Discussions](https://github.com/maxwharris/trending-aggregator/discussions)
- 💬 **Questions** - Tag us in issues with `question` label

### **Stay Updated**
- ⭐ **Star this repository** to stay updated
- 👀 **Watch releases** for new features
- 🍴 **Fork** to contribute your improvements

---

<div align="center">

**🔥 Built with passion for trend analysis and automation 🔥**

[⭐ Star](https://github.com/maxwharris/trending-aggregator) • [🍴 Fork](https://github.com/maxwharris/trending-aggregator/fork) • [📖 Docs](https://github.com/maxwharris/trending-aggregator/wiki) • [🐛 Issues](https://github.com/maxwharris/trending-aggregator/issues)

</div>
