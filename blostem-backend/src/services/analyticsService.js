const leads = require('../../data/leads');
const campaigns = require('../../data/campaigns');

const getAnalytics = (range = 30) => {
  const multiplier = range / 30;
  
  const baseMetrics = {
    totalLeads: leads.length,
    activeCampaigns: campaigns.filter(c => c.status === 'Active').length,
    totalCampaigns: campaigns.length,
    complianceScore: 94
  };
  
  const emailMetrics = {
    sent: Math.floor(847 * multiplier),
    opened: Math.floor(412 * multiplier),
    clicked: Math.floor(156 * multiplier),
    replied: Math.floor(48 * multiplier),
    bounced: Math.floor(23 * multiplier)
  };
  
  const openRate = Math.round((emailMetrics.opened / emailMetrics.sent) * 100);
  const clickRate = Math.round((emailMetrics.clicked / emailMetrics.opened) * 100);
  const replyRate = Math.round((emailMetrics.replied / emailMetrics.opened) * 100);
  
  const funnelData = [
    { stage: 'Emails Sent', count: emailMetrics.sent, color: '#0F172A' },
    { stage: 'Opened', count: emailMetrics.opened, color: '#64748B' },
    { stage: 'Clicked', count: emailMetrics.clicked, color: '#F59E0B' },
    { stage: 'Replied', count: emailMetrics.replied, color: '#10B981' },
    { stage: 'Converted', count: Math.floor(emailMetrics.replied * 0.4), color: '#059669' }
  ];
  
  const leadScoreDistribution = [
    { range: '90-100', count: leads.filter(l => l.score >= 90).length, color: '#10B981' },
    { range: '80-89', count: leads.filter(l => l.score >= 80 && l.score < 90).length, color: '#34D399' },
    { range: '70-79', count: leads.filter(l => l.score >= 70 && l.score < 80).length, color: '#F59E0B' },
    { range: '60-69', count: leads.filter(l => l.score >= 60 && l.score < 70).length, color: '#FBBF24' },
    { range: '0-59', count: leads.filter(l => l.score < 60).length, color: '#EF4444' }
  ];
  
  const campaignPerformance = campaigns.map(camp => {
    const campaignLeads = leads.filter(l => camp.leadIds.includes(l.id));
    const avgScore = Math.round(campaignLeads.reduce((sum, l) => sum + l.score, 0) / campaignLeads.length);
    
    return {
      id: camp.id,
      name: camp.name,
      leads: campaignLeads.length,
      avgScore,
      status: camp.status,
      emailsSent: Math.floor(50 * multiplier * (campaignLeads.length / 3)),
      openRate: Math.floor(40 + Math.random() * 20),
      clickRate: Math.floor(15 + Math.random() * 10)
    };
  });
  
  const topPerformingTemplates = [
    { name: 'Intro - Fintech', openRate: 52, clickRate: 18, replies: 24 },
    { name: 'Follow-up - Value Prop', openRate: 38, clickRate: 12, replies: 15 },
    { name: 'Intro - Enterprise', openRate: 45, clickRate: 14, replies: 19 },
    { name: 'Follow-up - Case Study', openRate: 28, clickRate: 8, replies: 11 },
    { name: 'Intro - SaaS', openRate: 41, clickRate: 11, replies: 13 }
  ];
  
  const trendData = generateTrendData(range);
  
  return {
    metrics: {
      ...baseMetrics,
      emailMetrics,
      openRate,
      clickRate,
      replyRate
    },
    funnelData,
    leadScoreDistribution,
    campaignPerformance,
    topPerformingTemplates,
    trendData
  };
};

const generateTrendData = (days) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      leads: Math.floor(2 + Math.random() * 5),
      emails: Math.floor(20 + Math.random() * 30),
      opens: Math.floor(10 + Math.random() * 15),
      clicks: Math.floor(3 + Math.random() * 8)
    });
  }
  
  return data;
};

module.exports = {
  getAnalytics
};