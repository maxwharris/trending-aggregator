const { TwitterApi } = require('twitter-api-v2');
const { twitter, interestTags } = require('../../config/config');

const client = new TwitterApi({
  appKey: twitter.appKey,
  appSecret: twitter.appSecret,
  accessToken: twitter.accessToken,
  accessSecret: twitter.accessSecret,
});

async function fetchTwitter() {
  const results = [];
  for (const tag of interestTags) {
    try {
      const searchResults = await client.v2.search(tag, {
        max_results: 10,
        'tweet.fields': 'public_metrics,created_at',
      });

      for await (const tweet of searchResults) {
        results.push({
          source: 'twitter',
          topic: tag,
          title: tweet.text,
          link: `https://twitter.com/i/web/status/${tweet.id}`,
          retweets: tweet.public_metrics.retweet_count,
          likes: tweet.public_metrics.like_count,
          replies: tweet.public_metrics.reply_count,
          createdAt: new Date(tweet.created_at),
        });
      }
    } catch (error) {
      console.error(`Error fetching tweets for topic "${tag}":`, error.message);
    }
  }
  return results;
}

module.exports = fetchTwitter;
