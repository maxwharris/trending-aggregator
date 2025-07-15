import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SettingsPage() {
  const [apiConfigs, setApiConfigs] = useState([]);
  const [topicConfigs, setTopicConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('apis');
  const [testingApi, setTestingApi] = useState(null);
  const [editingCredentials, setEditingCredentials] = useState({});
  const [showCredentials, setShowCredentials] = useState({});

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const [apisResponse, topicsResponse] = await Promise.all([
        axios.get('/api/config/apis'),
        axios.get('/api/config/topics')
      ]);
      
      setApiConfigs(apisResponse.data);
      setTopicConfigs(topicsResponse.data);
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaults = async () => {
    try {
      setSaving(true);
      await axios.post('/api/config/initialize');
      await fetchConfigurations();
      alert('Default configurations initialized successfully!');
    } catch (error) {
      console.error('Error initializing defaults:', error);
      alert('Failed to initialize default configurations');
    } finally {
      setSaving(false);
    }
  };

  const testApiConnection = async (apiName) => {
    try {
      setTestingApi(apiName);
      const response = await axios.post(`/api/config/apis/${apiName}/test`);
      
      if (response.data.isWorking) {
        alert(`${apiName} API connection successful!`);
      } else {
        alert(`${apiName} API connection failed: ${response.data.error}`);
      }
      
      await fetchConfigurations(); // Refresh to show updated status
    } catch (error) {
      console.error('Error testing API:', error);
      alert(`Failed to test ${apiName} API connection`);
    } finally {
      setTestingApi(null);
    }
  };

  const updateApiConfig = async (apiName, updates) => {
    try {
      setSaving(true);
      await axios.post(`/api/config/apis/${apiName}`, updates);
      await fetchConfigurations();
    } catch (error) {
      console.error('Error updating API config:', error);
      alert('Failed to update API configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateTopicConfig = async (topicName, updates) => {
    try {
      setSaving(true);
      await axios.post(`/api/config/topics/${topicName}`, updates);
      await fetchConfigurations();
    } catch (error) {
      console.error('Error updating topic config:', error);
      alert('Failed to update topic configuration');
    } finally {
      setSaving(false);
    }
  };

  const addSubreddit = (topicIndex, subredditName) => {
    if (!subredditName.trim()) return;
    
    const updatedTopics = [...topicConfigs];
    const topic = updatedTopics[topicIndex];
    
    if (!topic.subreddits.find(sub => sub.name === subredditName)) {
      topic.subreddits.push({
        name: subredditName,
        enabled: true,
        priority: topic.subreddits.length + 1
      });
      
      updateTopicConfig(topic.topicName, topic);
    }
  };

  const removeSubreddit = (topicIndex, subredditIndex) => {
    const updatedTopics = [...topicConfigs];
    updatedTopics[topicIndex].subreddits.splice(subredditIndex, 1);
    
    const topic = updatedTopics[topicIndex];
    updateTopicConfig(topic.topicName, topic);
  };

  const getApiStatusIcon = (api) => {
    if (!api.status) return '❓';
    if (api.status.isWorking) return '✅';
    if (api.status.errorCount > 0) return '❌';
    return '⚠️';
  };

  const getApiStatusText = (api) => {
    if (!api.status) return 'Unknown';
    if (api.status.isWorking) return 'Working';
    if (api.status.errorCount > 0) return `Error: ${api.status.lastError}`;
    return 'Not tested';
  };

  const toggleCredentialEdit = (apiName) => {
    setEditingCredentials(prev => ({
      ...prev,
      [apiName]: !prev[apiName]
    }));
  };

  const toggleShowCredential = (apiName, field) => {
    const key = `${apiName}_${field}`;
    setShowCredentials(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateCredentials = async (apiName, credentials) => {
    const api = apiConfigs.find(a => a.apiName === apiName);
    const updatedApi = {
      ...api,
      credentials: { ...api.credentials, ...credentials }
    };
    await updateApiConfig(apiName, updatedApi);
  };

  const getCredentialStatus = (api) => {
    const creds = api.credentials || {};
    
    switch (api.apiName) {
      case 'reddit':
        const hasRedditCreds = creds.clientId && creds.clientSecret && creds.username && creds.password;
        return hasRedditCreds ? '🔑' : '❌';
      case 'news':
        return creds.apiKey ? '🔑' : '❌';
      case 'twitter':
        const hasTwitterCreds = creds.accessToken && creds.accessSecret;
        return hasTwitterCreds ? '🔑' : '❌';
      default:
        return '❓';
    }
  };

  const renderCredentialForm = (api) => {
    const creds = api.credentials || {};
    const isEditing = editingCredentials[api.apiName];
    
    if (!isEditing) return null;

    switch (api.apiName) {
      case 'reddit':
        return (
          <div className="credentials-form">
            <h5>📝 Reddit API Credentials</h5>
            <div className="credential-grid">
              <div className="form-group">
                <label>Client ID:</label>
                <div className="credential-input-group">
                  <input
                    type={showCredentials[`reddit_clientId`] ? 'text' : 'password'}
                    className="form-input"
                    value={creds.clientId || ''}
                    onChange={(e) => updateCredentials('reddit', { clientId: e.target.value })}
                    placeholder="Enter Reddit Client ID"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm show-hide-btn"
                    onClick={() => toggleShowCredential('reddit', 'clientId')}
                  >
                    {showCredentials[`reddit_clientId`] ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Client Secret:</label>
                <div className="credential-input-group">
                  <input
                    type={showCredentials[`reddit_clientSecret`] ? 'text' : 'password'}
                    className="form-input"
                    value={creds.clientSecret || ''}
                    onChange={(e) => updateCredentials('reddit', { clientSecret: e.target.value })}
                    placeholder="Enter Reddit Client Secret"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm show-hide-btn"
                    onClick={() => toggleShowCredential('reddit', 'clientSecret')}
                  >
                    {showCredentials[`reddit_clientSecret`] ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  className="form-input"
                  value={creds.username || ''}
                  onChange={(e) => updateCredentials('reddit', { username: e.target.value })}
                  placeholder="Enter Reddit Username"
                />
              </div>
              
              <div className="form-group">
                <label>Password:</label>
                <div className="credential-input-group">
                  <input
                    type={showCredentials[`reddit_password`] ? 'text' : 'password'}
                    className="form-input"
                    value={creds.password || ''}
                    onChange={(e) => updateCredentials('reddit', { password: e.target.value })}
                    placeholder="Enter Reddit Password"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm show-hide-btn"
                    onClick={() => toggleShowCredential('reddit', 'password')}
                  >
                    {showCredentials[`reddit_password`] ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>User Agent:</label>
                <input
                  type="text"
                  className="form-input"
                  value={creds.userAgent || 'trending-aggregator:v1.0.0'}
                  onChange={(e) => updateCredentials('reddit', { userAgent: e.target.value })}
                  placeholder="trending-aggregator:v1.0.0"
                />
              </div>
            </div>
          </div>
        );
        
      case 'news':
        return (
          <div className="credentials-form">
            <h5>📝 News API Credentials</h5>
            <div className="form-group">
              <label>API Key:</label>
              <div className="credential-input-group">
                <input
                  type={showCredentials[`news_apiKey`] ? 'text' : 'password'}
                  className="form-input"
                  value={creds.apiKey || ''}
                  onChange={(e) => updateCredentials('news', { apiKey: e.target.value })}
                  placeholder="Enter News API Key"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm show-hide-btn"
                  onClick={() => toggleShowCredential('news', 'apiKey')}
                >
                  {showCredentials[`news_apiKey`] ? '🙈' : '👁️'}
                </button>
              </div>
              <small className="form-help">
                Get your API key from <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">newsapi.org</a>
              </small>
            </div>
          </div>
        );
        
      case 'twitter':
        return (
          <div className="credentials-form">
            <h5>📝 Twitter API Credentials</h5>
            <div className="credential-grid">
              <div className="form-group">
                <label>Access Token:</label>
                <div className="credential-input-group">
                  <input
                    type={showCredentials[`twitter_accessToken`] ? 'text' : 'password'}
                    className="form-input"
                    value={creds.accessToken || ''}
                    onChange={(e) => updateCredentials('twitter', { accessToken: e.target.value })}
                    placeholder="Enter Access Token"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm show-hide-btn"
                    onClick={() => toggleShowCredential('twitter', 'accessToken')}
                  >
                    {showCredentials[`twitter_accessToken`] ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Access Secret:</label>
                <div className="credential-input-group">
                  <input
                    type={showCredentials[`twitter_accessSecret`] ? 'text' : 'password'}
                    className="form-input"
                    value={creds.accessSecret || ''}
                    onChange={(e) => updateCredentials('twitter', { accessSecret: e.target.value })}
                    placeholder="Enter Access Secret"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm show-hide-btn"
                    onClick={() => toggleShowCredential('twitter', 'accessSecret')}
                  >
                    {showCredentials[`twitter_accessSecret`] ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>
            <small className="form-help">
              Get your credentials from <a href="https://developer.twitter.com/" target="_blank" rel="noopener noreferrer">Twitter Developer Portal</a>
            </small>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="main-content">
          <div className="loading">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button 
            className="btn btn-secondary" 
            onClick={initializeDefaults}
            disabled={saving}
          >
            {saving ? 'Initializing...' : 'Initialize Defaults'}
          </button>
        </div>

        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'apis' ? 'active' : ''}`}
            onClick={() => setActiveTab('apis')}
          >
            API Configuration
          </button>
          <button 
            className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Topics & Subreddits
          </button>
        </div>

        {activeTab === 'apis' && (
          <div className="settings-section">
            <h3>API Configuration</h3>
            <div className="api-configs">
              {apiConfigs.map((api) => (
                <div key={api.apiName} className="api-config-card">
                  <div className="api-header">
                    <h4>
                      {getApiStatusIcon(api)} {api.apiName.charAt(0).toUpperCase() + api.apiName.slice(1)} API {getCredentialStatus(api)}
                    </h4>
                    <div className="api-controls">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleCredentialEdit(api.apiName)}
                      >
                        {editingCredentials[api.apiName] ? 'Hide Credentials' : 'Edit Credentials'}
                      </button>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={api.enabled}
                          onChange={(e) => updateApiConfig(api.apiName, { ...api, enabled: e.target.checked })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => testApiConnection(api.apiName)}
                        disabled={testingApi === api.apiName}
                      >
                        {testingApi === api.apiName ? 'Testing...' : 'Test'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="api-status">
                    Status: {getApiStatusText(api)}
                    {api.status?.lastTested && (
                      <span className="last-tested">
                        (Last tested: {new Date(api.status.lastTested).toLocaleString()})
                      </span>
                    )}
                  </div>

                  {renderCredentialForm(api)}

                  {api.enabled && (
                    <div className="api-settings">
                      {api.apiName === 'reddit' && (
                        <div className="form-group">
                          <label>Posts per subreddit:</label>
                          <input
                            type="number"
                            className="form-input"
                            value={api.settings?.postsPerSubreddit || 5}
                            onChange={(e) => updateApiConfig(api.apiName, {
                              ...api,
                              settings: { ...api.settings, postsPerSubreddit: parseInt(e.target.value) }
                            })}
                            min="1"
                            max="25"
                          />
                        </div>
                      )}
                      
                      {api.apiName === 'news' && (
                        <div className="form-group">
                          <label>Articles per topic:</label>
                          <input
                            type="number"
                            className="form-input"
                            value={api.settings?.articlesPerTopic || 10}
                            onChange={(e) => updateApiConfig(api.apiName, {
                              ...api,
                              settings: { ...api.settings, articlesPerTopic: parseInt(e.target.value) }
                            })}
                            min="1"
                            max="50"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="settings-section">
            <h3>Topics & Subreddits</h3>
            <div className="topic-configs">
              {topicConfigs.map((topic, topicIndex) => (
                <div key={topic.topicName} className="topic-config-card">
                  <div className="topic-header">
                    <h4>{topic.topicName.charAt(0).toUpperCase() + topic.topicName.slice(1)}</h4>
                    <div className="topic-controls">
                      <label>Priority:</label>
                      <input
                        type="number"
                        className="form-input priority-input"
                        value={topic.priority}
                        onChange={(e) => updateTopicConfig(topic.topicName, {
                          ...topic,
                          priority: parseInt(e.target.value)
                        })}
                        min="1"
                        max="10"
                      />
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={topic.enabled}
                          onChange={(e) => updateTopicConfig(topic.topicName, {
                            ...topic,
                            enabled: e.target.checked
                          })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="subreddits-section">
                    <h5>Subreddits:</h5>
                    <div className="subreddits-list">
                      {topic.subreddits?.map((subreddit, subIndex) => (
                        <div key={subIndex} className="subreddit-item">
                          <span className="subreddit-name">r/{subreddit.name}</span>
                          <div className="subreddit-controls">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={subreddit.enabled}
                                onChange={(e) => {
                                  const updatedTopic = { ...topic };
                                  updatedTopic.subreddits[subIndex].enabled = e.target.checked;
                                  updateTopicConfig(topic.topicName, updatedTopic);
                                }}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeSubreddit(topicIndex, subIndex)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="add-subreddit">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Add subreddit name (without r/)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSubreddit(topicIndex, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addSubreddit(topicIndex, input.value);
                          input.value = '';
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
