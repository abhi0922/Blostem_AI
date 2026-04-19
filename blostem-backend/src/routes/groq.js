const express = require('express');
const router = express.Router();
const groqService = require('../services/groqService');

router.post('/analyze-lead', async (req, res) => {
  try {
    const { companyData } = req.body;
    
    if (!companyData || !companyData.company) {
      return res.status(400).json({ error: 'Company data is required' });
    }
    
    const analysis = await groqService.generateLeadAnalysis(companyData);
    res.json({ analysis });
  } catch (error) {
    console.error('Lead analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze lead' });
  }
});

router.post('/generate-email', async (req, res) => {
  try {
    const { leadData, contactData, templateType } = req.body;
    
    if (!leadData || !contactData) {
      return res.status(400).json({ error: 'Lead and contact data are required' });
    }
    
    const email = await groqService.generateOutreachEmail(
      leadData, 
      contactData, 
      templateType || 'intro'
    );
    
    res.json({ email });
  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

router.post('/generate-persona', async (req, res) => {
  try {
    const { company, role } = req.body;
    
    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' });
    }
    
    const persona = await groqService.generatePersona(company, role);
    res.json({ persona });
  } catch (error) {
    console.error('Persona generation error:', error);
    res.status(500).json({ error: 'Failed to generate persona' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await groqService.generateCompletion(
      message,
      context || 'You are Blostem AI, a helpful B2B sales and marketing assistant.'
    );
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

module.exports = router;