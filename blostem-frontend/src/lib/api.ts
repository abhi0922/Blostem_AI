const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  leads: {
    generate: (industry?: string, count?: number) =>
      fetchAPI<{ leads: any[]; count: number }>(`/leads/generate?industry=${industry || ''}&count=${count || 5}`),
    getAll: (params?: { page?: number; limit?: number; industry?: string; minScore?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.industry) query.set('industry', params.industry);
      if (params?.minScore) query.set('minScore', params.minScore);
      if (params?.status) query.set('status', params.status);
      return fetchAPI<{ leads: any[]; pagination: any }>(`/leads?${query.toString()}`);
    },
    getById: (id: string) => fetchAPI<any>(`/leads/${id}`),
  },
  outreach: {
    generate: (leadId: string, contactId: string, templateType?: string) =>
      fetchAPI<any>('/outreach/generate', {
        method: 'POST',
        body: JSON.stringify({ leadId, contactId, templateType }),
      }),
  },
  compliance: {
    check: (content: string) =>
      fetchAPI<any>('/compliance/check', {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  },
  analytics: {
    get: (range?: number) => fetchAPI<any>(`/analytics?range=${range || 30}`),
  },
  campaigns: {
    getAll: () => fetchAPI<any[]>('/campaigns'),
    getById: (id: string) => fetchAPI<any>(`/campaigns/${id}`),
    create: (data: any) =>
      fetchAPI<any>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<any>(`/campaigns/${id}`, {
        method: 'DELETE',
      }),
  },
  ai: {
    analyzeLead: (companyData: any) =>
      fetchAPI<any>('/ai/analyze-lead', {
        method: 'POST',
        body: JSON.stringify({ companyData }),
      }),
    generateEmail: (leadData: any, contactData: any, templateType?: string) =>
      fetchAPI<any>('/ai/generate-email', {
        method: 'POST',
        body: JSON.stringify({ leadData, contactData, templateType }),
      }),
    generatePersona: (company: string, role: string) =>
      fetchAPI<any>('/ai/generate-persona', {
        method: 'POST',
        body: JSON.stringify({ company, role }),
      }),
    chat: (message: string, context?: string) =>
      fetchAPI<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
      }),
  },
};