require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const outreachRoutes = require('./routes/outreach');
const complianceRoutes = require('./routes/compliance');
const analyticsRoutes = require('./routes/analytics');
const campaignRoutes = require('./routes/campaigns');
const groqRoutes = require('./routes/groq');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/outreach', outreachRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ai', groqRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Blostem AI Engine running on port ${PORT}`);
  console.log(`Using Groq API for AI features`);
});

module.exports = app;