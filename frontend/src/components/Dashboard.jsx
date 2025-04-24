import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopicChart from './TopicChart';

function Dashboard() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios
      .get('/api/topics')
      .then((response) => setTopics(response.data))
      .catch((error) => console.error('Error fetching topics:', error));
  }, []);

  return (
    <div>
      <h2>Trending Topics</h2>
      {topics.map((topic, index) => (
        <div key={index}>
          <a href={topic.link} target="_blank" rel="noopener noreferrer">
            {topic.title}
          </a>
          <p>Source: {topic.source}</p>
          <p>Published At: {new Date(topic.publishedAt).toLocaleString()}</p>
          <TopicChart topic={topic.topic} source={topic.source} />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
