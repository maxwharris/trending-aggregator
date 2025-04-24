function calculatePopularity(metrics, createdAt) {
    const { likes = 0, retweets = 0, replies = 0, upvotes = 0, comments = 0 } = metrics;
    const ageInHours = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);
    const decay = Math.exp(-ageInHours / 24); // Decay over 1 day
  
    const score = (likes + 2 * retweets + 0.5 * replies + upvotes + 0.5 * comments) * decay;
    return score;
  }
  
  module.exports = calculatePopularity;
  