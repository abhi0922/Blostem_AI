'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Filter, Zap, TrendingUp, Building2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState({ industry: '', minScore: '', status: '' });

  const fetchLeads = async () => {
    try {
      const result = await api.leads.getAll({
        industry: filters.industry || undefined,
        minScore: filters.minScore || undefined,
        status: filters.status || undefined,
      });
      setLeads(result.leads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLeads = async () => {
    setGenerating(true);
    try {
      const result = await api.leads.generate(filters.industry || undefined, 5);
      setLeads(result.leads);
    } catch (error) {
      console.error('Failed to generate leads:', error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Contacted': return 'bg-blue-100 text-blue-700';
      case 'Nurture': return 'bg-amber-100 text-amber-700';
      case 'Closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lead Intelligence</h1>
          <p className="text-slate-500 mt-1">Discover and score high-intent enterprise leads</p>
        </div>
        <button
          onClick={generateLeads}
          disabled={generating}
          className="btn-primary flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {generating ? 'Generating...' : 'Generate Leads'}
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filters.industry}
          onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Industries</option>
          <option value="Fintech">Fintech</option>
          <option value="SaaS">SaaS</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Cloud Infrastructure">Cloud Infrastructure</option>
          <option value="Data Security">Data Security</option>
          <option value="Blockchain">Blockchain</option>
          <option value="Retail Tech">Retail Tech</option>
        </select>
        <select
          value={filters.minScore}
          onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Scores</option>
          <option value="80">80+ (Hot)</option>
          <option value="60">60+ (Warm)</option>
          <option value="40">40+ (Cold)</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Contacted">Contacted</option>
          <option value="Nurture">Nurture</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{lead.company}</h3>
                    <p className="text-sm text-slate-500">{lead.industry}</p>
                  </div>
                </div>
                <span className={`score-badge ${getScoreClass(lead.score)}`}>
                  {lead.score}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{lead.funding}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Hiring: {lead.hiringTrend}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {lead.signals.slice(0, 3).map((signal, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {signal}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <Link
                  href={`/leads/${lead.id}`}
                  className="text-amber-600 text-sm flex items-center gap-1 hover:underline"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {leads.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-slate-500">No leads found. Click &quot;Generate Leads&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}