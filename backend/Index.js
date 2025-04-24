const express = require('express');
const mongoose = require('mongoose');
const searchRoute = require('./routes/search');
const popularityRoute = require('./routes/popularity');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
