'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Mail, Clock, Users, Play, Pause, Trash2, Edit, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Campaign, Lead } from '@/types';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    leadIds: [] as string[],
    sequence: [
      { step: 1, subject: '', body: '', delayDays: 0 },
      { step: 2, subject: '', body: '', delayDays: 3 },
      { step: 3, subject: '', body: '', delayDays: 5 },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, leadsData] = await Promise.all([
          api.campaigns.getAll(),
          api.leads.getAll(),
        ]);
        setCampaigns(campaignsData);
        setLeads(leadsData.leads);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createCampaign = async () => {
    try {
      const result = await api.campaigns.create(formData);
      setCampaigns([...campaigns, result]);
      setShowForm(false);
      setFormData({
        name: '',
        leadIds: [],
        sequence: [
          { step: 1, subject: '', body: '', delayDays: 0 },
          { step: 2, subject: '', body: '', delayDays: 3 },
          { step: 3, subject: '', body: '', delayDays: 5 },
        ],
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Draft' : 'Active';
    try {
      await api.campaigns.update(id, { status: newStatus });
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.campaigns.delete(id);
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Draft': return 'bg-slate-100 text-slate-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaign Builder</h1>
          <p className="text-slate-500 mt-1">Create and manage email outreach sequences</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Q1 Fintech Outreach"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Leads</label>
              <div className="flex flex-wrap gap-2">
                {leads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      const newLeadIds = formData.leadIds.includes(lead.id)
                        ? formData.leadIds.filter(id => id !== lead.id)
                        : [...formData.leadIds, lead.id];
                      setFormData({ ...formData, leadIds: newLeadIds });
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.leadIds.includes(lead.id)
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lead.company}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Sequence</label>
              {formData.sequence.map((step, idx) => (
                <div key={idx} className="mb-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded">Step {step.step}</span>
                    <span className="text-sm text-slate-500">Send after {step.delayDays} days</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={step.subject}
                      onChange={(e) => {
                        const newSequence = [...formData.sequence];
                        newSequence[idx].subject = e.target.value;
                        setFormData({ ...formData, sequence: newSequence });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Email subject..."
                    />
                    <textarea
                      value={step.body}
                      onChange={(e) => {
                        const newSequence = [...formData.sequence];
                        newSequence[idx].body = e.target.value;
                        setFormData({ ...formData, sequence: newSequence });
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-24"
                      placeholder="Email body... Use {{name}}, {{company}} for personalization"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={createCampaign} className="btn-primary">
                Create Campaign
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Leads</th>
              <th>Steps</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="font-medium text-slate-900">{campaign.name}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    {campaign.leadIds.length} leads
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {campaign.sequence.length} emails
                  </div>
                </td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="text-slate-500">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                      className="p-2 hover:bg-slate-100 rounded"
                      title={campaign.status === 'Active' ? 'Pause' : 'Activate'}
                    >
                      {campaign.status === 'Active' ? (
                        <Pause className="w-4 h-4 text-slate-600" />
                      ) : (
                        <Play className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="p-2 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {campaigns.length === 0 && !loading && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No campaigns yet. Click &quot;New Campaign&quot; to create one.</p>
        </div>
      )}
    </div>
  );
}