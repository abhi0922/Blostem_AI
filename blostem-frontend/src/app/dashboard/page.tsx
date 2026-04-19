'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Target, ShieldCheck, DollarSign, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface DashboardData {
  metrics: {
    totalLeads: number;
    activeCampaigns: number;
    totalCampaigns: number;
    complianceScore: number;
    emailMetrics: {
      sent: number;
      opened: number;
      clicked: number;
      replied: number;
      bounced: number;
    };
    openRate: number;
    clickRate: number;
    replyRate: number;
  };
  trendData: { date: string; leads: number; emails: number; opens: number; clicks: number }[];
  leadScoreDistribution: { range: string; count: number; color: string }[];
  funnelData: { stage: string; count: number; color: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.analytics.get(30);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Leads', value: data?.metrics.totalLeads || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Active Campaigns', value: data?.metrics.activeCampaigns || 0, icon: Target, color: 'text-purple-500' },
    { label: 'Compliance Score', value: `${data?.metrics.complianceScore || 0}%`, icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Email Open Rate', value: `${data?.metrics.openRate || 0}%`, icon: TrendingUp, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here&apos;s your marketing overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/leads" className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Generate Leads
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Lead Generation Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => value.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="leads" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2} />
              <Area type="monotone" dataKey="emails" stroke="#0F172A" fill="#E2E8F0" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Lead Score Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.leadScoreDistribution || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} width={60} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Email Funnel</h2>
          <Link href="/analytics" className="text-amber-600 text-sm flex items-center gap-1 hover:underline">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data?.funnelData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Email Performance</h2>
        </div>
        <div className="grid grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{data?.metrics.emailMetrics.sent || 0}</p>
            <p className="text-sm text-slate-500">Sent</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{data?.metrics.emailMetrics.opened || 0}</p>
            <p className="text-sm text-slate-500">Opened</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{data?.metrics.emailMetrics.clicked || 0}</p>
            <p className="text-sm text-slate-500">Clicked</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{data?.metrics.emailMetrics.replied || 0}</p>
            <p className="text-sm text-slate-500">Replied</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-red-500">{data?.metrics.emailMetrics.bounced || 0}</p>
            <p className="text-sm text-slate-500">Bounced</p>
          </div>
        </div>
      </div>
    </div>
  );
}