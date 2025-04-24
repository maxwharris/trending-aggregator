const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

async function sendSpikeAlertEmail(topic, spikeDetails) {
  const message = `
    Spike detected for topic: ${topic.topic} (${topic.source})
    Current Popularity Score: ${spikeDetails.currentScore}
    Average Recent Score: ${spikeDetails.avgRecentScore.toFixed(2)}
    Spike Factor: ${spikeDetails.spikeFactor.toFixed(2)}x

    Link: ${topic.link || 'N/A'}
    Time: ${new Date().toISOString()}
  `;

  const mailOptions = {
    from: process.env.ALERT_EMAIL_USER,
    to: process.env.ALERT_EMAIL_RECEIVER,
    subject: `Trending Spike Alert: ${topic.topic}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Spike alert email sent for topic: ${topic.topic}`);
  } catch (error) {
    console.error('Error sending spike alert email:', error.message);
  }
}

module.exports = sendSpikeAlertEmail;
