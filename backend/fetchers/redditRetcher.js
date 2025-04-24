const axios = require('axios');
const qs = require('qs');
const { reddit, interestTags } = require('../../config/config');

async function getRedditToken() {
  const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  const auth = Buffer.from(`${reddit.clientId}:${reddit.clientSecret}`).toString('base64');
  const data = qs.stringify({
    grant_type: 'password',
    username: reddit.username,
    password: reddit.password,
  });

  const response = await axios.post(tokenUrl, data, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

async function fetchReddit() {
  const token = await getRedditToken();
  const results = [];
  for (const tag of interestTags) {
    const url = `https://oauth.reddit.com/r/all/search?q=${encodeURIComponent(tag)}&sort=top&t=day&limit=10`;
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': reddit.userAgent,
        },
      });
      data.data.children.forEach(post => {
        results.push({
          source: 'reddit',
          topic: tag,
          title: post.data.title,
          link: `https://reddit.com${post.data.permalink}`,
          upvotes: post.data.ups,
          comments: post.data.num_comments,
          createdAt: new Date(post.data.created_utc * 1000),
        });
      });
    } catch (error) {
      console.error(`Error fetching Reddit posts for topic "${tag}":`, error.message);
    }
  }
  return results;
}

module.exports = fetchReddit;
