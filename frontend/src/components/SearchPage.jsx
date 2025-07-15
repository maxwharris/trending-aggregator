import React, { useState } from 'react';
import axios from 'axios';

function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [timeRange, setTimeRange] = useState('day');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('Please enter a search keyword');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const response = await axios.get('/api/search', { 
        params: { keyword: keyword.trim(), timeRange } 
      });
      
      setResults(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search topics. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

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

  return (
    <div className="container">
      <div className="main-content">
        <h2 className="text-center mb-4">🔍 Search Trending Topics</h2>
        
        <div className="search-form">
          <form onSubmit={handleSearch}>
            <div className="search-controls">
              <div className="form-group mb-0">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter keyword (e.g., technology, sports, politics...)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <div className="form-group mb-0">
                <select 
                  className="form-select" 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="hour">Past Hour</option>
                  <option value="day">Past Day</option>
                  <option value="week">Past Week</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-2">
              <p className="text-danger">{error}</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading">Searching for topics...</div>
        )}

        {hasSearched && !loading && (
          <div className="results-container">
            <div className="results-header">
              <h3>Search Results for "{keyword}"</h3>
              <div className="results-count">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </div>
            </div>

            {results.length === 0 ? (
              <div className="empty-state">
                <h3>No results found</h3>
                <p>Try searching with different keywords or expanding your time range.</p>
              </div>
            ) : (
              <div className="results-list">
                {results.map((topic, index) => (
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="empty-state">
            <h3>Ready to explore trending topics?</h3>
            <p>Enter a keyword above to search across news, Reddit, and Twitter for the latest trends.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
