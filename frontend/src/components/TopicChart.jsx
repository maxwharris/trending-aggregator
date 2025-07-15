import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TopicChart({ topic, source }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/popularity', { 
          params: { topic, source } 
        });
        
        const data = response.data;
        
        if (data && data.length > 0) {
          // Sort data by timestamp
          const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          
          setChartData({
            labels: sortedData.map((entry) => 
              new Date(entry.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit'
              })
            ),
            datasets: [
              {
                label: 'Popularity Score',
                data: sortedData.map((entry) => entry.popularityScore),
                fill: false,
                borderColor: '#2563eb',
                backgroundColor: '#2563eb',
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                borderWidth: 2,
              },
            ],
          });
        } else {
          setChartData(null);
        }
      } catch (err) {
        console.error('Error fetching popularity data:', err);
        setError('Failed to load chart data');
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    if (topic && source) {
      fetchChartData();
    }
  }, [topic, source]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2563eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return `Time: ${context[0].label}`;
          },
          label: (context) => {
            return `Popularity: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#e2e8f0',
          borderColor: '#cbd5e1',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          maxTicksLimit: 6,
        },
      },
      y: {
        display: true,
        grid: {
          color: '#e2e8f0',
          borderColor: '#cbd5e1',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toFixed(1);
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <div style={{ height: '200px' }}>
        <div className="loading">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '200px' }} className="empty-state">
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  if (!chartData || chartData.datasets[0].data.length === 0) {
    return (
      <div style={{ height: '200px' }} className="empty-state">
        <p className="text-muted">No popularity data available for this topic</p>
      </div>
    );
  }

  return (
    <div style={{ height: '200px', position: 'relative' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default TopicChart;
