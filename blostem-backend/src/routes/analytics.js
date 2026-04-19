const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

router.get('/', (req, res) => {
  const { range = 30 } = req.query;
  const analytics = analyticsService.getAnalytics(parseInt(range));
  res.json(analytics);
});

module.exports = router;