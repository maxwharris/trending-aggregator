function calculatePopularity(metrics, createdAt, source = 'unknown') {
    const { 
      likes = 0, 
      retweets = 0, 
      replies = 0, 
      upvotes = 0, 
      comments = 0,
      views = 0,
      shares = 0
    } = metrics;
    
    // Pure engagement-based scoring - no time decay, no source-specific multipliers
    // Focus only on upvotes/likes/comments/views/shares as requested
    
    let engagementScore = 0;
    
    // Core engagement metrics with balanced weighting
    engagementScore += upvotes;           // Reddit upvotes
    engagementScore += likes;             // Twitter/social likes
    engagementScore += (comments * 2);    // Comments are valuable (shows deeper engagement)
    engagementScore += (replies * 2);     // Replies similar to comments
    engagementScore += (views / 100);     // Views (scaled down as they're typically much higher)
    engagementScore += (shares * 3);      // Shares are very valuable (viral potential)
    engagementScore += (retweets * 3);    // Retweets are shares on Twitter
    
    // Ensure minimum score
    return Math.max(engagementScore, 0.1);
}

module.exports = calculatePopularity;
