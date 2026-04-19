const leads = require('../../data/leads');
const contacts = require('../../data/contacts');

const generateOutreachEmail = (leadId, contactId, templateType) => {
  const lead = leads.find(l => l.id === leadId);
  const contact = contacts.find(c => c.id === contactId);
  
  if (!lead || !contact) {
    return { error: 'Lead or contact not found' };
  }
  
  const templates = {
    intro: {
      subject: `Quick question about ${lead.company}'s growth`,
      body: `Hi ${contact.name},

I noticed ${lead.company}'s recent ${lead.funding || 'funding'} and impressive trajectory. We're helping fintech companies like yours streamline operations and accelerate growth.

With your role as ${contact.role}, I imagine you're focused on ${getPainPoints(contact.role)}.

Would you be open to a quick 15-minute call to explore if we could help?

Best,
Blostem Team`
    },
    followup1: {
      subject: `Following up - ${lead.company}`,
      body: `Hi ${contact.name},

Just wanted to follow up on my previous email. I know you're busy leading ${lead.company}'s ${getFocusArea(contact.role)}.

I'd love to share how similar companies achieved 3x ROI within 6 months. Would a brief 10-minute call work for you?

Best,
Blostem Team`
    },
    followup2: {
      subject: `One more thought for ${lead.company}`,
      body: `Hi ${contact.name},

I'll keep this brief. Here's a quick case study showing how we helped a ${lead.industry} company like ${lead.company} achieve:

• 40% faster compliance
• 60% cost reduction
• 3x ROI in first year

[Link to case study]

Would you be open to a quick demo?

Best,
Blostem Team`
    }
  };
  
  const template = templates[templateType] || templates.intro;
  
  return {
    leadId,
    contactId,
    contactName: contact.name,
    company: lead.company,
    ...template,
    generatedAt: new Date().toISOString()
  };
};

const getPainPoints = (role) => {
  const painPoints = {
    'CTO': 'scaling infrastructure and maintaining developer velocity',
    'Product Head': 'user acquisition and product-market fit',
    'Compliance Officer': 'regulatory compliance and audit readiness',
    'Product Manager': 'roadmap prioritization and stakeholder alignment',
    'VP Engineering': 'team performance and technical debt'
  };
  return painPoints[role] || 'business growth';
};

const getFocusArea = (role) => {
  const focusAreas = {
    'CTO': 'technology strategy and infrastructure',
    'Product Head': 'product vision and roadmap',
    'Compliance Officer': 'risk management and compliance',
    'Product Manager': 'product development',
    'VP Engineering': 'engineering operations'
  };
  return focusAreas[role] || 'operations';
};

module.exports = {
  generateOutreachEmail
};