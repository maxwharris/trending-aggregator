# Trending Aggregator - Setup Instructions

## Fixes Applied

The following critical issues have been fixed to make the application fully functional:

### 1. Configuration Management
- ✅ Created `config/config.js` to properly export configuration objects
- ✅ Integrated with existing `.env` file for API keys and credentials

### 2. File Naming Issues
- ✅ Fixed typo: `redditRetcher.js` → `redditFetcher.js`
- ✅ Updated package.json scripts to match actual filenames

### 3. Frontend Setup
- ✅ Created `frontend/package.json` with proper React configuration
- ✅ Added React build tools and development scripts
- ✅ Configured proxy to backend server (port 4000)

### 4. Dependencies
- ✅ Added missing `qs` dependency for Reddit API authentication
- ✅ Installed all required dependencies for both backend and frontend

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)
- API Keys for:
  - NewsAPI
  - Reddit API
  - Twitter API (optional)
  - Email service (Gmail recommended)

### 1. Environment Configuration
Update the `.env` file with your actual API credentials:

```env
# Server Configuration
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/trending-aggregator

# NewsAPI Configuration
NEWS_API_KEY=your_actual_newsapi_key

# Reddit API Configuration
REDDIT_CLIENT_ID=your_actual_reddit_client_id
REDDIT_CLIENT_SECRET=your_actual_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
REDDIT_USER_AGENT=trending-aggregator:v1.0.0 (by /u/yourusername)

# Twitter API Configuration (Optional)
TWITTER_APP_KEY=your_twitter_app_key
TWITTER_APP_SECRET=your_twitter_app_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Email Alert Configuration
ALERT_EMAIL_USER=your_email@gmail.com
ALERT_EMAIL_PASS=your_app_password
ALERT_EMAIL_RECEIVER=alerts@yourdomain.com
```

### 2. Database Setup
Ensure MongoDB is running:
- **Local**: Start MongoDB service
- **Cloud**: Update `MONGODB_URI` in `.env` to your cloud connection string

### 3. Install Dependencies
Dependencies have already been installed, but if needed:
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install
```

### 4. Running the Application

#### Development Mode (Recommended)
```bash
npm run dev
```
This starts both backend (port 4000) and frontend (port 3000) concurrently.

#### Individual Services
```bash
# Backend only
npm start

# Frontend only
npm run client

# Data fetching only
npm run fetch
```

### 5. API Endpoints
- **Backend**: http://localhost:4000
- **Frontend**: http://localhost:3000
- **Search**: GET `/api/search?keyword=technology&timeRange=day`
- **Popularity**: GET `/api/popularity?topic=technology&source=news`

### 6. Data Collection
Run the data fetcher to populate the database:
```bash
npm run fetch
```

## Project Structure
```
trending-aggregator/
├── backend/
│   ├── Index.js              # Main server file
│   ├── fetchAll.js           # Data collection script
│   ├── fetchers/             # API data fetchers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   └── utils/                # Utility functions
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main React app
│   │   └── index.js         # React entry point
│   └── package.json         # Frontend dependencies
├── config/
│   ├── config.js            # Configuration management
│   └── interests.json       # Topics to track
├── .env                     # Environment variables
└── package.json             # Root dependencies
```

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **API Rate Limits**: Some APIs have rate limits; consider implementing delays
3. **CORS Issues**: Frontend proxy is configured to handle this
4. **Missing API Keys**: Ensure all required API keys are properly set in `.env`

### Security Notes
- Never commit `.env` file to version control
- Use app-specific passwords for Gmail
- Consider using environment-specific configuration files for production

## Next Steps
1. Configure your API keys in `.env`
2. Start MongoDB
3. Run `npm run dev` to start the application
4. Run `npm run fetch` to collect initial data
5. Access the frontend at http://localhost:3000
