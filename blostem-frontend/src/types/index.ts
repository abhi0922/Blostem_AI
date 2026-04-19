export interface Lead {
  id: string;
  company: string;
  industry: string;
  funding: string;
  hiringTrend: 'High' | 'Medium' | 'Low';
  score: number;
  signals: string[];
  status: 'Active' | 'Contacted' | 'Nurture' | 'Closed';
  aiReasoning: string;
  engagementProbability: number;
  bestContactTime: string;
  recommendedAction: string;
}

export interface Contact {
  id: string;
  leadId: string;
  name: string;
  role: string;
  company: string;
  email: string;
  persona: string;
}

export interface Campaign {
  id: string;
  name: string;
  leadIds: string[];
  sequence: EmailStep[];
  status: 'Draft' | 'Active' | 'Completed';
  createdAt: string;
}

export interface EmailStep {
  step: number;
  subject: string;
  body: string;
  delayDays: number;
}

export interface ComplianceResult {
  passed: boolean;
  status: 'PASS' | 'WARNING' | 'FAIL';
  riskScore: number;
  totalIssues: number;
  issues: ComplianceIssue[];
  recommendations: string[];
  checkedAt: string;
}

export interface ComplianceIssue {
  ruleId: string;
  name: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  matches: number;
  found: string;
}

export interface AnalyticsData {
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
  funnelData: { stage: string; count: number; color: string }[];
  leadScoreDistribution: { range: string; count: number; color: string }[];
  campaignPerformance: {
    id: string;
    name: string;
    leads: number;
    avgScore: number;
    status: string;
    emailsSent: number;
    openRate: number;
    clickRate: number;
  }[];
  topPerformingTemplates: { name: string; openRate: number; clickRate: number; replies: number }[];
  trendData: { date: string; leads: number; emails: number; opens: number; clicks: number }[];
}