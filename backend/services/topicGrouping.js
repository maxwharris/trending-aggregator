const Topic = require('../models/Topic');

class TopicGroupingService {
  constructor() {
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'from', 'up', 'about', 'into', 'over', 'after'
    ]);
  }

  // Extract keywords from title, removing stop words and common terms
  extractKeywords(title) {
    if (!title) return [];
    
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !this.stopWords.has(word) &&
        !word.match(/^\d+$/) // Remove pure numbers
      )
      .slice(0, 10); // Limit to first 10 keywords
  }

  // Calculate similarity between two sets of keywords
  calculateSimilarity(keywords1, keywords2) {
    if (!keywords1.length || !keywords2.length) return 0;
    
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    
    // Calculate Jaccard similarity (intersection / union)
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // Check if two topics should be grouped together
  shouldGroup(topic1, topic2, threshold = 0.3) {
    // Don't group topics from the same source with identical titles
    if (topic1.source === topic2.source && topic1.title === topic2.title) {
      return false;
    }

    const keywords1 = this.extractKeywords(topic1.title);
    const keywords2 = this.extractKeywords(topic2.title);
    
    const similarity = this.calculateSimilarity(keywords1, keywords2);
    
    // Also check if they share the same main topic category
    const sameCategory = topic1.topic === topic2.topic;
    
    // Group if similarity is high OR if they're in the same category with some similarity
    return similarity >= threshold || (sameCategory && similarity >= 0.2);
  }

  // Group similar topics and calculate combined popularity
  async groupSimilarTopics() {
    try {
      console.log('🔗 Starting topic grouping process...');
      
      // Get all topics from the last 7 days, sorted by popularity
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const allTopics = await Topic.find({
        createdAt: { $gte: oneWeekAgo }
      }).sort({ popularityScore: -1 });

      console.log(`📊 Processing ${allTopics.length} topics for grouping`);

      const groups = [];
      const processed = new Set();

      // Group similar topics
      for (let i = 0; i < allTopics.length; i++) {
        if (processed.has(allTopics[i]._id.toString())) continue;

        const currentGroup = {
          mainTopic: allTopics[i],
          relatedTopics: [],
          combinedScore: allTopics[i].popularityScore,
          totalArticles: 1,
          sources: new Set([allTopics[i].source]),
          keywords: this.extractKeywords(allTopics[i].title),
          latestDate: allTopics[i].publishedAt || allTopics[i].createdAt
        };

        processed.add(allTopics[i]._id.toString());

        // Find similar topics
        for (let j = i + 1; j < allTopics.length; j++) {
          if (processed.has(allTopics[j]._id.toString())) continue;

          if (this.shouldGroup(allTopics[i], allTopics[j])) {
            currentGroup.relatedTopics.push(allTopics[j]);
            currentGroup.combinedScore += allTopics[j].popularityScore;
            currentGroup.totalArticles++;
            currentGroup.sources.add(allTopics[j].source);
            
            // Update latest date if this topic is newer
            const topicDate = allTopics[j].publishedAt || allTopics[j].createdAt;
            if (topicDate > currentGroup.latestDate) {
              currentGroup.latestDate = topicDate;
            }

            processed.add(allTopics[j]._id.toString());
          }
        }

        // Apply grouping bonus - more articles = higher combined score
        if (currentGroup.totalArticles > 1) {
          const groupingBonus = Math.log(currentGroup.totalArticles) * 10;
          currentGroup.combinedScore += groupingBonus;
        }

        groups.push(currentGroup);
      }

      // Sort groups by combined score
      groups.sort((a, b) => b.combinedScore - a.combinedScore);

      console.log(`✅ Grouped ${allTopics.length} topics into ${groups.length} groups`);
      console.log(`📈 Top groups: ${groups.slice(0, 5).map(g => `"${g.mainTopic.title}" (${g.totalArticles} articles, score: ${Math.round(g.combinedScore)})`).join(', ')}`);

      return groups;

    } catch (error) {
      console.error('❌ Error in topic grouping:', error.message);
      return [];
    }
  }

  // Get trending topics with grouping applied
  async getTrendingTopics(limit = 20) {
    const groups = await this.groupSimilarTopics();
    
    return groups.slice(0, limit).map(group => ({
      id: group.mainTopic._id,
      title: group.mainTopic.title,
      topic: group.mainTopic.topic,
      source: group.mainTopic.source,
      link: group.mainTopic.link,
      summary: group.mainTopic.summary,
      imageUrl: group.mainTopic.imageUrl,
      publishedAt: group.mainTopic.publishedAt,
      createdAt: group.mainTopic.createdAt,
      metrics: group.mainTopic.metrics,
      popularityScore: group.combinedScore,
      
      // Grouping information
      relatedArticles: group.relatedTopics.map(topic => ({
        id: topic._id,
        title: topic.title,
        source: topic.source,
        link: topic.link,
        summary: topic.summary,
        imageUrl: topic.imageUrl,
        publishedAt: topic.publishedAt,
        popularityScore: topic.popularityScore,
        metrics: topic.metrics
      })),
      totalArticles: group.totalArticles,
      sources: Array.from(group.sources),
      latestUpdate: group.latestDate
    }));
  }

  // Get topic statistics
  async getTopicStats() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const [totalTopics, groups] = await Promise.all([
      Topic.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      this.groupSimilarTopics()
    ]);

    const groupedTopics = groups.reduce((sum, group) => sum + group.totalArticles, 0);
    const averageGroupSize = groups.length > 0 ? groupedTopics / groups.length : 0;

    return {
      totalTopics,
      totalGroups: groups.length,
      groupedTopics,
      averageGroupSize: Math.round(averageGroupSize * 10) / 10,
      topGroupSize: groups.length > 0 ? groups[0].totalArticles : 0
    };
  }
}

module.exports = new TopicGroupingService();
