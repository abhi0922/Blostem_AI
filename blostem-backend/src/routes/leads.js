const express = require('express');
const router = express.Router();
const leadService = require('../services/leadService');

router.get('/generate', (req, res) => {
  const { industry, count } = req.query;
  const generatedLeads = leadService.generateLeads(industry, parseInt(count) || 5);
  res.json({ leads: generatedLeads, count: generatedLeads.length });
});

router.get('/', (req, res) => {
  const { page = 1, limit = 10, industry, minScore, status } = req.query;
  const filters = { industry, minScore, status };
  const allLeads = leadService.getAllLeads(filters);
  
  const startIndex = (page - 1) * limit;
  const paginatedLeads = allLeads.slice(startIndex, startIndex + parseInt(limit));
  
  res.json({
    leads: paginatedLeads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: allLeads.length,
      pages: Math.ceil(allLeads.length / limit)
    }
  });
});

router.get('/:id', (req, res) => {
  const lead = leadService.getLeadById(req.params.id);
  
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  
  res.json(lead);
});

module.exports = router;