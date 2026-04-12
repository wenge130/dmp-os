// ─── DMP OS Backend API Client ───────────────────────────────────────────────
// Connects the React frontend to the Express backend running on port 4000.
//
// URL resolution strategy:
//   1. VITE_API_BASE_URL env var (set at build time for custom deployments)
//   2. GitHub Pages (wenge130.github.io) → http://localhost:4000/api (local backend)
//   3. Dev mode (localhost:3000) → /api (Vite proxy forwards to localhost:4000)

function resolveApiBase(): string {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // When served from GitHub Pages, the backend must be running locally
  if (typeof window !== 'undefined' && window.location.hostname === 'wenge130.github.io') {
    return 'http://localhost:4000/api';
  }
  // Dev mode: Vite proxy handles /api → localhost:4000
  return '/api';
}

const API_BASE = resolveApiBase();

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
