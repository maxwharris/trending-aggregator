# 📈 Trending Aggregator

> A comprehensive trending topics aggregator that monitors and analyzes popularity across multiple social platforms

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Required-green.svg)](https://www.mongodb.com/)

## 🚀 Overview

Trending Aggregator is a full-stack application that monitors trending topics across multiple platforms including News APIs, Reddit, and Twitter. It analyzes engagement metrics, calculates popularity scores, and detects viral spikes in real-time.

## ✨ Features

- **Multi-Platform Monitoring** - Aggregates data from News API, Reddit, and Twitter
- **Real-Time Analytics** - Calculates popularity scores based on engagement metrics
- **Spike Detection** - Identifies viral trends and sudden popularity increases
- **Historical Analysis** - Stores and tracks topic popularity over time
- **Interactive Dashboard** - React-based frontend with charts and search functionality
- **Email Alerts** - Automated notifications for trending spikes
- **RESTful API** - Backend API for data access and integration

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- Twitter API v2
- Reddit API
- News API

**Frontend:**
- React 19
- Chart.js for data visualization
- React Router for navigation
- Axios for API calls

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- API Keys for:
  - [News API](https://newsapi.org/)
  - [Reddit API](https://www.reddit.com/dev/api/)
  - [Twitter API](https://developer.twitter.com/) (optional)

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
Copy the `.env` file and update with your API credentials:

```env
# Server Configuration
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/trending-aggregator

# API Keys (replace with your actual keys)
NEWS_API_KEY=your_newsapi_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=trending-aggregator:v1.0.0 (by /u/yourusername)

# Twitter API (Optional)
TWITTER_APP_KEY=your_twitter_app_key
TWITTER_APP_SECRET=your_twitter_app_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Email Alerts
ALERT_EMAIL_USER=your_email@gmail.com
ALERT_EMAIL_PASS=your_app_password
ALERT_EMAIL_RECEIVER=alerts@yourdomain.com
```

### 4. Start the Application
```bash
# Test configuration
npm run test-config

# Start both backend and frontend
npm run dev

# Or start individually
npm start          # Backend only
npm run client     # Frontend only
```

### 5. Collect Initial Data
```bash
npm run fetch
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search` | GET | Search topics with filters |
| `/api/popularity` | GET | Get popularity data for topics |

### Example Usage
```bash
# Search for technology topics from the last day
GET /api/search?keyword=technology&timeRange=day

# Get popularity data for a specific topic
GET /api/popularity?topic=technology&source=news
```

## 🏗️ Project Structure

```
trending-aggregator/
├── backend/
│   ├── Index.js              # Main server file
│   ├── fetchAll.js           # Data collection script
│   ├── fetchers/             # API data fetchers
│   │   ├── newsFetcher.js
│   │   ├── redditFetcher.js
│   │   └── twitterFetcher.js
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   └── utils/                # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main React app
│   │   └── index.js         # Entry point
│   └── public/
├── config/
│   ├── config.js            # Configuration management
│   └── interests.json       # Topics to track
└── .env                     # Environment variables
```

## 📈 Monitored Topics

The application tracks the following topics by default:
- Technology
- Science
- Health
- Sports
- Entertainment
- Business
- Politics
- Education
- Environment
- Travel

*Topics can be customized in `config/interests.json`*

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start backend server |
| `npm run client` | Start frontend development server |
| `npm run dev` | Start both backend and frontend |
| `npm run fetch` | Run data collection |
| `npm run test-config` | Test configuration setup |

## 🚨 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
Database connection error: connect ECONNREFUSED
```
- Ensure MongoDB is running locally or update `MONGODB_URI` for cloud instance

**API Rate Limits**
- Some APIs have rate limits; consider implementing delays between requests
- Monitor API usage in respective developer consoles

**CORS Issues**
- Frontend proxy is configured to handle CORS
- Ensure backend is running on port 4000

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [News API](https://newsapi.org/) for news data
- [Reddit API](https://www.reddit.com/dev/api/) for social media insights
- [Twitter API](https://developer.twitter.com/) for real-time trends
- [Chart.js](https://www.chartjs.org/) for data visualization

## 📞 Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/maxwharris/trending-aggregator/issues)
- Check the [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup guide

---

⭐ **Star this repository if you find it helpful!**
