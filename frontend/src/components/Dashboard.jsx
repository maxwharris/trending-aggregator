import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopicChart from './TopicChart';

function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        // Fetch grouped trending topics
        const response = await axios.get('/api/trending', {
          params: { limit: 20 }
        });
        setTopics(response.data.data || []); // Use the new grouped API
        setError(null);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load trending topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
    
    // Auto-refresh every 30 minutes to match the data fetching schedule
    const interval = setInterval(fetchTopics, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceClass = (source) => {
    return `topic-source ${source.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="main-content">
          <div className="loading">Loading trending topics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="main-content">
          <div className="empty-state">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="results-header">
          <h2>🔥 Trending Topics</h2>
          <div className="results-count">
            {topics.length} topics found
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state">
            <h3>No trending topics found</h3>
            <p>Check back later for the latest trends!</p>
          </div>
        ) : (
          <div className="results-list">
            {topics.map((topic, index) => (
              <div key={topic.id || index} className="topic-card-enhanced">
                {/* Hero Image */}
                {topic.imageUrl && (
                  <div className="topic-image">
                    <img 
                      src={topic.imageUrl} 
                      alt={topic.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="topic-content">
                  <div className="topic-header">
                    <div className="topic-title">
                      <a href={topic.link} target="_blank" rel="noopener noreferrer">
                        {topic.title}
                      </a>
                    </div>
                    
                    <div className="topic-meta">
                      <span className={getSourceClass(topic.source)}>
                        {topic.source.charAt(0).toUpperCase() + topic.source.slice(1)}
                      </span>
                      <span className="topic-date">
                        {formatDate(topic.publishedAt || topic.createdAt)}
                      </span>
                      
                      {/* Article count badge */}
                      {topic.totalArticles > 1 && (
                        <span className="article-count">
                          📰 {topic.totalArticles} articles
                        </span>
                      )}
                      
                      {/* Multi-source badge */}
                      {topic.sources && topic.sources.length > 1 && (
                        <span className="multi-source">
                          🔗 {topic.sources.length} sources
                        </span>
                      )}
                      
                      {/* Enhanced engagement metrics */}
                      {topic.metrics && (
                        <span className="engagement-metrics">
                          {topic.metrics.upvotes > 0 && `⬆️ ${topic.metrics.upvotes}`}
                          {topic.metrics.likes > 0 && ` ❤️ ${topic.metrics.likes}`}
                          {topic.metrics.comments > 0 && ` 💬 ${topic.metrics.comments}`}
                          {topic.metrics.shares > 0 && ` 🔄 ${topic.metrics.shares}`}
                        </span>
                      )}
                      
                      {/* Popularity score */}
                      <span className="popularity-score">
                        🔥 {Math.round(topic.popularityScore)}
                      </span>
                    </div>
                  </div>

                  {topic.summary && (
                    <div className="card-content">
                      <p className="text-muted">{topic.summary}</p>
                    </div>
                  )}

                  {/* Related Articles */}
                  {topic.relatedArticles && topic.relatedArticles.length > 0 && (
                    <div className="related-articles">
                      <h4>Related Articles ({topic.relatedArticles.length})</h4>
                      <div className="related-list">
                        {topic.relatedArticles.slice(0, 3).map((related, idx) => (
                          <div key={idx} className="related-item">
                            {related.imageUrl && (
                              <img 
                                src={related.imageUrl} 
                                alt={related.title}
                                className="related-thumb"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="related-content">
                              <a href={related.link} target="_blank" rel="noopener noreferrer" className="related-title">
                                {related.title}
                              </a>
                              <div className="related-meta">
                                <span className={getSourceClass(related.source)}>
                                  {related.source}
                                </span>
                                <span className="related-score">
                                  🔥 {Math.round(related.popularityScore)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {topic.relatedArticles.length > 3 && (
                          <div className="more-articles">
                            +{topic.relatedArticles.length - 3} more articles
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="chart-container">
                    <div className="chart-title">
                      Popularity Trend - {topic.topic}
                    </div>
                    <TopicChart topic={topic.topic} source={topic.source} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
