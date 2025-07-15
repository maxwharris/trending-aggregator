# Contributing to Trending Aggregator

🎉 **Thank you for your interest in contributing to Trending Aggregator!** 🎉

We welcome contributions from the community and are excited to see what you'll bring to this project. This guide will help you get started with contributing.

## 🚀 Quick Start for Contributors

### 1. Fork & Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/trending-aggregator.git
cd trending-aggregator

# Add the original repository as upstream
git remote add upstream https://github.com/maxwharris/trending-aggregator.git
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Copy environment template
cp .env.example .env

# Edit .env with your API keys (see README.md for details)
# At minimum, you need News API and Reddit API keys
```

### 3. Start Development Servers
```bash
# Start backend (with automated scheduler)
npm start

# In another terminal, start frontend
npm run client

# Or start both with one command
npm run dev
```

## 🎯 Ways to Contribute

### 🐛 **Bug Reports**
Found a bug? Help us fix it!

**Before submitting:**
- Check if the issue already exists in [GitHub Issues](https://github.com/maxwharris/trending-aggregator/issues)
- Try to reproduce the bug with the latest version

**When reporting:**
- Use a clear, descriptive title
- Describe the expected vs actual behavior
- Include steps to reproduce
- Add screenshots if applicable
- Include your environment details (OS, Node version, etc.)

### 💡 **Feature Requests**
Have an idea for improvement?

**Great areas for enhancement:**
- New data sources (YouTube, TikTok, LinkedIn, etc.)
- Enhanced topic grouping algorithms
- Better visualization options
- Mobile app development
- Performance optimizations
- Additional analytics features

### 🔧 **Code Contributions**

#### **Good First Issues**
Look for issues labeled `good first issue` or `help wanted`:
- UI/UX improvements
- Documentation updates
- Bug fixes
- Test coverage improvements
- Performance optimizations

#### **Advanced Contributions**
- New API integrations
- Machine learning for topic classification
- Real-time WebSocket updates
- Advanced analytics features
- Scalability improvements

## 📋 Development Guidelines

### **Code Style**
- Use **ES6+** features and modern JavaScript
- Follow **consistent indentation** (2 spaces)
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**

### **Backend Development**
```javascript
// Example: Adding a new fetcher
const newFetcher = {
  async fetchData(topic) {
    try {
      // Implementation here
      return processedData;
    } catch (error) {
      console.error(`Error fetching ${topic}:`, error);
      throw error;
    }
  }
};
```

### **Frontend Development**
```jsx
// Example: Creating a new component
import React, { useState, useEffect } from 'react';

const NewComponent = ({ data }) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Component logic
  }, [data]);

  return (
    <div className="new-component">
      {/* Component JSX */}
    </div>
  );
};

export default NewComponent;
```

### **Database Changes**
- Update relevant models in `backend/models/`
- Consider migration scripts for existing data
- Test with both empty and populated databases
- Document schema changes

## 🧪 Testing

### **Manual Testing**
```bash
# Test API configuration
npm run test-config

# Test individual components
# Start the system and verify:
# ✅ Dashboard loads with grouped topics
# ✅ Search functionality works
# ✅ Settings page displays correctly
# ✅ Automated fetching runs every 30 minutes
```

### **API Testing**
```bash
# Test core endpoints
curl http://localhost:4000/api/trending
curl http://localhost:4000/api/search?keyword=technology
curl http://localhost:4000/api/scheduler/status

# Test with different parameters
curl "http://localhost:4000/api/trending?limit=10&category=technology"
```

## 📝 Pull Request Process

### **Before Submitting**
1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make your changes and test thoroughly**

4. **Commit with clear messages:**
   ```bash
   git commit -m "Add: New data source integration for LinkedIn"
   git commit -m "Fix: Topic grouping algorithm edge case"
   git commit -m "Update: Enhanced dashboard UI with better mobile support"
   ```

### **Pull Request Template**
When submitting a PR, please include:

```markdown
## 🎯 What does this PR do?
Brief description of the changes

## 🧪 How to test
Step-by-step testing instructions

## 📸 Screenshots (if applicable)
Before/after screenshots for UI changes

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Manual testing performed
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or clearly documented)
```

### **Review Process**
1. **Automated checks** will run on your PR
2. **Maintainers will review** your code
3. **Address feedback** if requested
4. **Merge** once approved!

## 🏗️ Project Architecture

### **Key Components**
```
backend/
├── services/           # Automation & core logic
│   ├── scheduler.js   # Automated data fetching
│   └── topicGrouping.js # Topic similarity detection
├── fetchers/          # API integrations
├── models/            # Database schemas
├── routes/            # API endpoints
└── utils/             # Helper functions

frontend/
├── components/        # React components
├── styles.css        # Styling
└── App.jsx           # Main application
```

### **Data Flow**
1. **Scheduler** triggers data fetching every 30 minutes
2. **Fetchers** collect data from APIs (News, Reddit, Twitter)
3. **Topic Grouping** identifies similar articles
4. **Database** stores processed, grouped topics
5. **Frontend** displays enhanced dashboard with groupings

## 🎨 UI/UX Contributions

### **Design Principles**
- **Clean & Modern** - Minimal, professional interface
- **Mobile-First** - Responsive design for all devices
- **Performance** - Fast loading and smooth interactions
- **Accessibility** - WCAG compliant where possible

### **Current Tech Stack**
- **React 19** with modern hooks
- **CSS3** with Flexbox/Grid
- **Chart.js** for data visualization
- **Responsive design** principles

## 🚀 Advanced Contributions

### **New Data Sources**
Want to add a new platform? Here's the pattern:

1. **Create fetcher** in `backend/fetchers/newPlatformFetcher.js`
2. **Update config** to include API credentials
3. **Modify scheduler** to include new source
4. **Update frontend** to display new source data
5. **Add tests** and documentation

### **Machine Learning Integration**
Opportunities for ML enhancement:
- **Better topic classification** using NLP
- **Sentiment analysis** for trending topics
- **Predictive analytics** for viral content
- **Personalized recommendations**

### **Performance Optimizations**
- **Database indexing** for faster queries
- **Caching layer** with Redis
- **API response optimization**
- **Frontend bundle optimization**

## 📚 Resources

### **Documentation**
- [README.md](README.md) - Main project documentation
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [API Documentation](https://github.com/maxwharris/trending-aggregator/wiki/API) - API reference

### **External APIs**
- [News API Documentation](https://newsapi.org/docs)
- [Reddit API Documentation](https://www.reddit.com/dev/api/)
- [Twitter API Documentation](https://developer.twitter.com/en/docs)

### **Tools & Libraries**
- [Node.js](https://nodejs.org/en/docs/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [React](https://reactjs.org/docs/)
- [Chart.js](https://www.chartjs.org/docs/)

## 🤝 Community

### **Getting Help**
- 💬 **GitHub Discussions** - Ask questions, share ideas
- 🐛 **GitHub Issues** - Report bugs, request features
- 📧 **Email** - For security issues or private matters

### **Code of Conduct**
We are committed to providing a welcoming and inclusive environment for all contributors. Please be:
- **Respectful** in all interactions
- **Constructive** in feedback and discussions
- **Collaborative** in problem-solving
- **Patient** with newcomers and questions

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **GitHub contributors** page
- **Release notes** for significant contributions

## 📞 Questions?

Don't hesitate to reach out if you have questions:
- Open a [GitHub Discussion](https://github.com/maxwharris/trending-aggregator/discussions)
- Create an [Issue](https://github.com/maxwharris/trending-aggregator/issues) with the `question` label
- Check existing documentation and issues first

---

**Thank you for contributing to Trending Aggregator! 🚀**

Every contribution, no matter how small, helps make this project better for everyone.
