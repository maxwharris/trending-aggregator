# trending aggregator

> automated trending topics aggregator with smart topic grouping

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Required-green.svg)](https://www.mongodb.com/)

## overview

trending aggregator automatically monitors trending topics across news api, reddit, and twitter. it runs every 30 minutes, groups similar articles together, and provides a clean dashboard for trend analysis.

## features

- **automated data fetching** - runs every 30 minutes
- **smart topic grouping** - groups similar articles using similarity detection
- **clean dashboard** - modern ui with grouped topics and images
- **search functionality** - search across all aggregated content
- **real-time updates** - auto-refresh dashboard
- **multi-source** - news api, reddit, twitter integration

## quick start

### 1. clone and install
```bash
git clone https://github.com/maxwharris/trending-aggregator.git
cd trending-aggregator
npm install
cd frontend && npm install && cd ..
```

### 2. setup environment
```bash
cp .env.example .env
# edit .env with your api keys
```

required api keys:
- [news api](https://newsapi.org/) - get free key
- [reddit api](https://www.reddit.com/prefs/apps) - create app

### 3. start the system
```bash
npm start
```

open http://localhost:3000 to view the dashboard

## api endpoints

| endpoint | description |
|----------|-------------|
| `GET /api/trending` | get grouped trending topics |
| `GET /api/search` | search topics |
| `GET /api/scheduler/status` | check automation status |
| `POST /api/scheduler/trigger` | manually trigger fetch |

## project structure

```
backend/
├── services/scheduler.js      # automated data fetching
├── services/topicGrouping.js  # topic similarity detection
├── fetchers/                  # api integrations
├── models/                    # database schemas
└── routes/                    # api endpoints

frontend/
├── components/                # react components
├── App.jsx                    # main app
└── styles.css                 # styling
```

## configuration

edit `config/interests.json` to customize monitored topics:
```json
["technology", "science", "health", "sports", "politics"]
```

## troubleshooting

**mongodb connection error**
- ensure mongodb is running: `mongod`
- check `MONGODB_URI` in .env

**api rate limits**
- news api: 1000 requests/day (free)
- reddit api: 60 requests/minute

**scheduler not running**
```bash
curl http://localhost:4000/api/scheduler/status
```

## scripts

| script | description |
|--------|-------------|
| `npm start` | start automated system |
| `npm run client` | start frontend only |
| `npm run dev` | start both backend and frontend |

## contributing

1. fork the repository
2. create feature branch: `git checkout -b feature/name`
3. make changes and test
4. submit pull request

see [contributing.md](CONTRIBUTING.md) for details.

## license

mit license - see [license](LICENSE) file
