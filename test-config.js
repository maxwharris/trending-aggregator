// Test script to verify configuration is working
const config = require('./config/config');

console.log('Testing configuration...\n');

console.log('✅ Config file loaded successfully');
console.log('✅ Interest tags:', config.interestTags.length, 'topics loaded');
console.log('✅ News API key configured:', config.newsApiKey ? 'Yes' : 'No (placeholder)');
console.log('✅ Reddit config:', config.reddit.clientId ? 'Yes' : 'No (placeholder)');
console.log('✅ Twitter config:', config.twitter.appKey ? 'Yes' : 'No (placeholder)');
console.log('✅ Email config:', config.email.user ? 'Yes' : 'No (placeholder)');

console.log('\nInterest topics to track:');
config.interestTags.forEach((topic, index) => {
  console.log(`  ${index + 1}. ${topic}`);
});

console.log('\n🎉 Configuration test completed successfully!');
console.log('\nNext steps:');
console.log('1. Update .env file with your actual API keys');
console.log('2. Start MongoDB service');
console.log('3. Run: npm run dev');
