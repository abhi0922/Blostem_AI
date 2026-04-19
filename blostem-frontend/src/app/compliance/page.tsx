'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { api } from '@/lib/api';
import { ComplianceResult } from '@/types';

const sampleEmails = {
  good: `Subject: Quick question about FinBank's growth plans

Hi Rahul,

I noticed FinBank's recent Series B round and impressive trajectory. We're helping fintech companies like yours streamline operations and accelerate growth.

Would you be open to a quick 15-minute call to explore if we could help?

Best,
Blostem Team`,
  bad: `Subject: ACT NOW! GUARANTEED 100% PROFIT - Limited Time Offer!

Hi John,

We GUARANTEE you will make money with our solution! This is a LIMITED TIME offer that will EXPIRE soon. Don't miss out on this incredible opportunity to earn guaranteed returns!

Click here NOW to buy our product and start making immediate income!

Act fast before it's too late!

Best,
Sales Team`,
};

export default function CompliancePage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkCompliance = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const data = await api.compliance.check(content);
      setResult(data);
    } catch (error) {
      console.error('Failed to check compliance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (type: 'good' | 'bad') => {
    setContent(sampleEmails[type]);
    setResult(null);
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.status === 'PASS') return <CheckCircle className="w-12 h-12 text-emerald-500" />;
    if (result.status === 'WARNING') return <AlertTriangle className="w-12 h-12 text-amber-500" />;
    return <XCircle className="w-12 h-12 text-red-500" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance Checker</h1>
          <p className="text-slate-500 mt-1">Validate your outreach messages for compliance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Email Content</h2>
            <div className="flex gap-2">
              <button
                onClick={() => loadSample('good')}
                className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
              >
                Good Example
              </button>
              <button
                onClick={() => loadSample('bad')}
                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Bad Example
              </button>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
            placeholder="Paste your email content here to check for compliance issues..."
          />

          <button
            onClick={checkCompliance}
            disabled={loading || !content.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Check Compliance
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Compliance Results</h2>

          {!result && (
            <div className="card text-center py-12">
              <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Enter email content and click &quot;Check Compliance&quot;</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`card flex items-center gap-4 ${result.passed ? 'border-emerald-500' : 'border-red-500'}`}>
                <div className="flex-shrink-0">{getStatusIcon()}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{result.status}</h3>
                  <p className="text-slate-500">Risk Score: {result.riskScore}/100</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">{result.totalIssues}</div>
                  <div className="text-sm text-slate-500">issues found</div>
                </div>
              </div>

              {result.issues.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold mb-3">Issues Detected</h3>
                  <div className="space-y-3">
                    {result.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{issue.name}</p>
                            <p className="text-sm opacity-80">{issue.message}</p>
                            <p className="text-xs mt-1 font-mono">
                              Found: &quot;{issue.found}&quot;
                            </p>
                          </div>
                          <span className="text-xs uppercase font-semibold">{issue.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendations.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-amber-500">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.passed && (
                <div className="card bg-emerald-50 border-emerald-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-800">All checks passed!</p>
                      <p className="text-sm text-emerald-600">Your email is ready for sending.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}