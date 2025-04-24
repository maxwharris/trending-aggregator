import React, { useState } from 'react';
import axios from 'axios';

function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [timeRange, setTimeRange] = useState('day');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    axios.get('/api/search', { params: { keyword, timeRange } })
      .then(response => setResults(response.data))
      .catch(error => console.error('Search error:', error));
  };

  return (
    <div>
      <h2>Search Topics</h2>
      <input
        type="text"
        placeholder="Enter keyword"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
        <option value="hour">Past Hour</option>
        <option value="day">Past Day</option>
        <option value="week">Past Week</option>
      </select>
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((topic, index) => (
          <li key={index}>
            <a href={topic.link} target="_blank" rel="noopener noreferrer">
              {topic.title}
            </a>
            <p>Source: {topic.source}</p>
            <p>Published At: {new Date(topic.publishedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchPage;
