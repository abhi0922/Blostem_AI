'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Mail, MousePointer, MessageCircle, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '@/lib/api';
import { AnalyticsData } from '@/types';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.analytics.get(range);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const metrics = [
    { label: 'Emails Sent', value: data?.metrics.emailMetrics.sent || 0, icon: Mail, change: 12 },
    { label: 'Open Rate', value: `${data?.metrics.openRate || 0}%`, icon: TrendingUp, change: 5 },
    { label: 'Click Rate', value: `${data?.metrics.clickRate || 0}%`, icon: MousePointer, change: -2 },
    { label: 'Reply Rate', value: `${data?.metrics.replyRate || 0}%`, icon: MessageCircle, change: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Track your campaign performance and engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-slate-400" />
                <span className={`flex items-center text-sm ${metric.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {metric.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(metric.change)}%
                </span>
              </div>
              <p className="stat-value">{metric.value}</p>
              <p className="stat-label">{metric.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Email Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => value.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="emails" stroke="#0F172A" fill="#E2E8F0" strokeWidth={2} name="Sent" />
              <Area type="monotone" dataKey="opens" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2} name="Opened" />
              <Area type="monotone" dataKey="clicks" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} name="Clicked" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Lead Score Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.leadScoreDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.funnelData || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Leads</th>
                  <th>Open Rate</th>
                  <th>Click Rate</th>
                </tr>
              </thead>
              <tbody>
                {data?.campaignPerformance.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="font-medium text-slate-900">{campaign.name}</td>
                    <td>{campaign.leads}</td>
                    <td>{campaign.openRate}%</td>
                    <td>{campaign.clickRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Top Performing Templates</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Open Rate</th>
                <th>Click Rate</th>
                <th>Replies</th>
              </tr>
            </thead>
            <tbody>
              {data?.topPerformingTemplates.map((template, idx) => (
                <tr key={idx}>
                  <td className="font-medium text-slate-900">{template.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${template.openRate}%` }}></div>
                      </div>
                      <span className="text-sm">{template.openRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${template.clickRate}%` }}></div>
                      </div>
                      <span className="text-sm">{template.clickRate}%</span>
                    </div>
                  </td>
                  <td className="font-medium">{template.replies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}