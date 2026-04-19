const leads = require('../../data/leads');
const contacts = require('../../data/contacts');

const generateLeads = (industry, count = 5) => {
  let filtered = leads;
  
  if (industry && industry !== 'All') {
    filtered = leads.filter(l => l.industry.toLowerCase() === industry.toLowerCase());
  }
  
  return filtered.slice(0, count).map(lead => ({
    ...lead,
    id: lead.id
  }));
};

const getLeadById = (id) => {
  const lead = leads.find(l => l.id === id);
  if (!lead) return null;
  
  const leadContacts = contacts.filter(c => c.leadId === id);
  return { ...lead, contacts: leadContacts };
};

const getAllLeads = (filters = {}) => {
  let result = [...leads];
  
  if (filters.industry && filters.industry !== 'All') {
    result = result.filter(l => l.industry.toLowerCase() === filters.industry.toLowerCase());
  }
  
  if (filters.minScore) {
    result = result.filter(l => l.score >= parseInt(filters.minScore));
  }
  
  if (filters.status) {
    result = result.filter(l => l.status === filters.status);
  }
  
  return result;
};

const getAllContacts = () => contacts;

const getContactById = (id) => contacts.find(c => c.id === id);

module.exports = {
  generateLeads,
  getLeadById,
  getAllLeads,
  getAllContacts,
  getContactById
};