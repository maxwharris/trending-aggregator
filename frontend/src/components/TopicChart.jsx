import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function TopicChart({ topic, source }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get('/api/popularity', { params: { topic, source } })
      .then((response) => {
        const data = response.data;
        setChartData({
          labels: data.map((entry) => new Date(entry.timestamp).toLocaleString()),
          datasets: [
            {
              label: 'Popularity Score',
              data: data.map((entry) => entry.popularityScore),
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        });
      })
      .catch((error) => console.error('Error fetching popularity data:', error));
  }, [topic, source]);

  return (
    <div>
      <h3>{topic} - {source}</h3>
      {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
}

export default TopicChart;
