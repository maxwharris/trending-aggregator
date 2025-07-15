const express = require('express');
const mongoose = require('mongoose');
const searchRoute = require('./routes/search');
const popularityRoute = require('./routes/popularity');
const configRoute = require('./routes/config');
const trendingRoute = require('./routes/trending');
const schedulerService = require('./services/scheduler');

require('dotenv').config();

// Fix mongoose deprecation warning
mongoose.set('strictQuery', false);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use('/api/search', searchRoute);
app.use('/api/popularity', popularityRoute);
app.use('/api/config', configRoute);
app.use('/api/trending', trendingRoute);

// Scheduler status and control endpoints
app.get('/api/scheduler/status', (req, res) => {
  res.json(schedulerService.getStatus());
});

app.post('/api/scheduler/trigger', async (req, res) => {
  try {
    await schedulerService.triggerManualFetch();
    res.json({ success: true, message: 'Manual fetch triggered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      
      // Start the automated scheduler
      schedulerService.start();
    });
  })
  .catch(error => {
    console.error('Database connection error:', error.message);
  });
