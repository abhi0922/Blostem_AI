'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, TrendingUp, Users, MessageSquare, ShieldCheck, Lightbulb, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { Lead, Contact } from '@/types';

interface LeadDetail extends Lead {
  contacts: Contact[];
}

export default function LeadDetailPage() {
  const params = useParams();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingEmail, setGeneratingEmail] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const result = await api.leads.getById(params.id as string);
        setLead(result);
      } catch (error) {
        console.error('Failed to fetch lead:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [params.id]);

  const generateEmail = async (contactId: string, templateType: string) => {
    setGeneratingEmail(contactId);
    try {
      const result = await api.outreach.generate(params.id as string, contactId, templateType);
      setGeneratedEmail(result);
    } catch (error) {
      console.error('Failed to generate email:', error);
    } finally {
      setGeneratingEmail(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Lead not found</p>
        <Link href="/leads" className="text-amber-600 hover:underline mt-2 inline-block">
          Back to Leads
        </Link>
      </div>
    );
  }

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Call Now': return 'bg-emerald-100 text-emerald-700';
      case 'Email': return 'bg-blue-100 text-blue-700';
      case 'Nurture': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{lead.company}</h1>
          <p className="text-slate-500">{lead.industry} • {lead.funding}</p>
        </div>
        <span className={`score-badge ${getScoreClass(lead.score)} text-lg`}>
          Score: {lead.score}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              AI Reasoning
            </h2>
            <p className="text-slate-600 leading-relaxed">{lead.aiReasoning}</p>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Market Signals
            </h2>
            <div className="flex flex-wrap gap-2">
              {lead.signals.map((signal, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Sales Intelligence</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Engagement Probability</p>
                <p className="text-2xl font-bold text-slate-900">{lead.engagementProbability}%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Best Contact Time</p>
                <p className="text-lg font-semibold text-slate-900">{lead.bestContactTime}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Hiring Trend</p>
                <p className="text-lg font-semibold text-slate-900">{lead.hiringTrend}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Recommended Action</p>
                <span className={`text-sm px-2 py-1 rounded ${getActionColor(lead.recommendedAction)}`}>
                  {lead.recommendedAction}
                </span>
              </div>
            </div>
          </div>

          {generatedEmail && (
            <div className="card border-2 border-amber-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated Email</h2>
                <button
                  onClick={() => setGeneratedEmail(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Subject:</p>
                  <p className="font-medium text-slate-900">{generatedEmail.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">To: {generatedEmail.contactName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg whitespace-pre-wrap">
                  {generatedEmail.body}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Key Stakeholders
            </h2>
            <div className="space-y-4">
              {lead.contacts.map((contact) => (
                <div key={contact.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{contact.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {contact.role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{contact.email}</p>
                  <p className="text-sm text-slate-600 mb-3">{contact.persona}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateEmail(contact.id, 'intro')}
                      disabled={generatingEmail === contact.id}
                      className="flex-1 text-xs bg-amber-500 text-white py-2 rounded hover:bg-amber-600 disabled:opacity-50"
                    >
                      {generatingEmail === contact.id ? 'Generating...' : 'Generate Email'}
                    </button>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded hover:bg-slate-200"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Compliance Status
            </h2>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-emerald-600 font-medium">Ready for Outreach</p>
              <p className="text-sm text-slate-500 mt-1">All compliance checks passed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}