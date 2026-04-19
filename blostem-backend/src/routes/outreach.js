const express = require('express');
const router = express.Router();
const outreachService = require('../services/outreachService');

router.post('/generate', (req, res) => {
  const { leadId, contactId, templateType = 'intro' } = req.body;
  
  if (!leadId || !contactId) {
    return res.status(400).json({ error: 'leadId and contactId are required' });
  }
  
  const email = outreachService.generateOutreachEmail(leadId, contactId, templateType);
  
  if (email.error) {
    return res.status(404).json(email);
  }
  
  res.json(email);
});

module.exports = router;