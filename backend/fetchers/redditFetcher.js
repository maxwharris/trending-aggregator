const axios = require('axios');
const qs = require('qs');
const { reddit, interestTags } = require('../../config/config');

// Map topics to relevant subreddits for better content
const topicSubreddits = {
  technology: ['technology', 'programming', 'gadgets'],
  science: ['science', 'askscience', 'space'],
  health: ['health', 'fitness', 'nutrition'],
  sports: ['sports', 'nfl', 'nba', 'soccer'],
  entertainment: ['movies', 'television', 'music'],
  business: ['business', 'entrepreneur', 'investing'],
  politics: ['politics', 'worldnews', 'news'],
  education: ['education', 'todayilearned', 'explainlikeimfive'],
  environment: ['environment', 'climate', 'sustainability'],
  travel: ['travel', 'solotravel', 'backpacking']
};

async function getRedditToken() {
  const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  const auth = Buffer.from(`${reddit.clientId}:${reddit.clientSecret}`).toString('base64');
  const data = qs.stringify({
    grant_type: 'password',
    username: reddit.username,
    password: reddit.password,
  });

  try {
    const response = await axios.post(tokenUrl, data, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': reddit.userAgent,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Reddit token:', error.response?.data || error.message);
    throw error;
  }
}

async function fetchFromSubreddit(token, subreddit, topic) {
  const url = `https://oauth.reddit.com/r/${subreddit}/top?t=day&limit=5`;
  
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': reddit.userAgent,
      },
    });

    return data.data.children.map(post => ({
      source: 'reddit',
      topic: topic, // Properly assign the topic for each post
      title: post.data.title,
      link: `https://reddit.com${post.data.permalink}`,
      upvotes: post.data.ups,
      comments: post.data.num_comments,
      upvoteRatio: post.data.upvote_ratio,
      score: post.data.score,
      subreddit: post.data.subreddit,
      author: post.data.author,
      createdAt: new Date(post.data.created_utc * 1000),
      summary: post.data.selftext ? post.data.selftext.substring(0, 200) + '...' : '',
    }));
  } catch (error) {
    console.error(`Error fetching from r/${subreddit}:`, error.response?.status, error.response?.statusText);
    return [];
  }
}

async function fetchReddit() {
  try {
    const token = await getRedditToken();
    const results = [];
    
    // Process each topic sequentially to avoid rate limiting
    for (const topic of interestTags) {
      const subreddits = topicSubreddits[topic] || [topic];
      
      console.log(`Fetching Reddit data for topic: ${topic}`);
      
      // Fetch from multiple subreddits for this topic
      for (const subreddit of subreddits) {
        try {
          const posts = await fetchFromSubreddit(token, subreddit, topic);
          results.push(...posts);
          
          // Add delay to respect rate limits (60 requests per minute)
          await new Promise(resolve => setTimeout(resolve, 1100));
        } catch (error) {
          console.error(`Failed to fetch from r/${subreddit} for topic ${topic}:`, error.message);
          continue;
        }
      }
    }

    // Remove duplicates based on Reddit post ID
    const uniqueResults = results.filter((post, index, self) => 
      index === self.findIndex(p => p.link === post.link)
    );

    // Sort by popularity (upvotes + comments weighted)
    uniqueResults.sort((a, b) => {
      const scoreA = a.upvotes + (a.comments * 0.5);
      const scoreB = b.upvotes + (b.comments * 0.5);
      return scoreB - scoreA;
    });

    console.log(`Successfully fetched ${uniqueResults.length} unique Reddit posts`);
    return uniqueResults;

  } catch (error) {
    console.error('Error in fetchReddit:', error.message);
    return [];
  }
}

module.exports = fetchReddit;
