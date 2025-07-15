const axios = require('axios');
const { newsApiKey, interestTags } = require('../../config/config');

async function fetchNews() {
  const results = [];
  for (const tag of interestTags) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(tag)}&pageSize=10&sortBy=publishedAt&apiKey=${newsApiKey}`;
    try {
      const { data } = await axios.get(url);
      data.articles.forEach(article => {
        results.push({
          source: 'news',
          topic: tag,
          title: article.title,
          link: article.url,
          summary: article.description,
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage, // Extract image from News API
          metrics: {
            likes: 0,
            retweets: 0,
            replies: 0,
            upvotes: 0,
            comments: 0,
            views: 0,
            shares: 0
          }
        });
      });
    } catch (error) {
      console.error(`Error fetching news for topic "${tag}":`, error.message);
    }
  }
  return results;
}

module.exports = fetchNews;
