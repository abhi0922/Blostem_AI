const express = require('express');
const router = express.Router();
const campaigns = require('../../data/campaigns');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  res.json(campaigns);
});

router.get('/:id', (req, res) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  res.json(campaign);
});

router.post('/', (req, res) => {
  const { name, leadIds, sequence } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Campaign name is required' });
  }
  
  const newCampaign = {
    id: uuidv4(),
    name,
    leadIds: leadIds || [],
    sequence: sequence || [],
    status: 'Draft',
    createdAt: new Date().toISOString()
  };
  
  campaigns.push(newCampaign);
  res.status(201).json(newCampaign);
});

router.put('/:id', (req, res) => {
  const { name, leadIds, sequence, status } = req.body;
  const index = campaigns.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  campaigns[index] = {
    ...campaigns[index],
    name: name || campaigns[index].name,
    leadIds: leadIds || campaigns[index].leadIds,
    sequence: sequence || campaigns[index].sequence,
    status: status || campaigns[index].status,
    updatedAt: new Date().toISOString()
  };
  
  res.json(campaigns[index]);
});

router.delete('/:id', (req, res) => {
  const index = campaigns.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  campaigns.splice(index, 1);
  res.json({ message: 'Campaign deleted successfully' });
});

module.exports = router;