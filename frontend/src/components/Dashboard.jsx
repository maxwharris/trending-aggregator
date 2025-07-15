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
        // Fetch recent topics from all sources
        const response = await axios.get('/api/search', {
          params: { keyword: '', timeRange: 'day' }
        });
        setTopics(response.data.slice(0, 20)); // Show top 20 recent topics
        setError(null);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load trending topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
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
              <div key={index} className="topic-card">
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
                </div>

                {topic.summary && (
                  <div className="card-content">
                    <p className="text-muted">{topic.summary}</p>
                  </div>
                )}

                <div className="chart-container">
                  <div className="chart-title">
                    Popularity Trend - {topic.topic}
                  </div>
                  <TopicChart topic={topic.topic} source={topic.source} />
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
