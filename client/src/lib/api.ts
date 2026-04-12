// ─── DMP OS Backend API Client ───────────────────────────────────────────────
// Connects the React frontend to the Express backend running on port 4000.
// In development, Vite proxies /api/* to http://localhost:4000.
// In production, the backend serves the built frontend and /api/* is co-located.

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── WSP Manuals ─────────────────────────────────────────────────────────────

export interface SubManualAPI {
  id: string;
  title: string;
  sections: number;
  completion: number;
  last_updated: string;
  supervisor: string;
  status: 'Current' | 'Under Review' | 'Needs Update' | 'Approved';
  version: string;
}

export const wspApi = {
  getManuals: () => request<SubManualAPI[]>('/wsp/manuals'),
  getManual: (id: string) => request<SubManualAPI>(`/wsp/manuals/${id}`),
  getAttestations: (wspId?: string) =>
    request<any[]>(wspId ? `/wsp/attestations?wsp_id=${wspId}` : '/wsp/attestations'),
  getGaps: (wspId?: string) =>
    request<any[]>(wspId ? `/wsp/gaps?wsp_id=${wspId}` : '/wsp/gaps'),
  getAlerts: () => request<any[]>('/wsp/alerts'),
  runGapAnalysis: (wspId: string, ruleNumber: string) =>
    request<{ analyzed: boolean; findings_count: number; findings: any[]; rule_source: string }>(
      '/wsp/gaps/analyze',
      { method: 'POST', body: JSON.stringify({ wsp_id: wspId, rule_number: ruleNumber }) }
    ),
  uploadDocument: (wspId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    form.append('wsp_id', wspId);
    return fetch(`${API_BASE}/wsp/documents/upload`, { method: 'POST', body: form }).then(r => r.json());
  },
};

// ─── FINRA ────────────────────────────────────────────────────────────────────

export const finraApi = {
  getHealth: () => request<{ connected: boolean; error?: string }>('/finra/health'),
  pollNow: () => request<{ polled: boolean; new_alerts: number }>('/finra/poll', { method: 'POST' }),
};
