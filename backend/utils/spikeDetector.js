function detectSpike(timestamps, currentScore, options = { windowSize: 4, spikeMultiplier: 2, minScore: 10 }) {
    if (!timestamps || timestamps.length < options.windowSize) {
      return { isSpike: false, reason: 'Not enough data points' };
    }
  
    const recentScores = timestamps
      .slice(-options.windowSize)
      .map(entry => entry.score);
  
    const avgRecentScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
    const spikeFactor = currentScore / avgRecentScore;
  
    const isSpike = currentScore > avgRecentScore * options.spikeMultiplier && currentScore > options.minScore;
  
    return {
      isSpike,
      avgRecentScore,
      currentScore,
      spikeFactor,
      reason: isSpike ? 'Spike detected' : 'No spike',
    };
  }
  
  module.exports = detectSpike;
  