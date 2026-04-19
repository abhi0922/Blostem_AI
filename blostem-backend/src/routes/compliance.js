const express = require('express');
const router = express.Router();
const complianceService = require('../services/complianceService');

router.post('/check', (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const result = complianceService.checkCompliance(content);
  res.json(result);
});

module.exports = router;