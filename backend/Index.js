const express = require('express');
const mongoose = require('mongoose');
const searchRoute = require('./routes/search');
const popularityRoute = require('./routes/popularity');

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

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error.message);
  });
