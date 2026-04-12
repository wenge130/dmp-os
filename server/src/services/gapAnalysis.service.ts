import OpenAI from 'openai';
import { nanoid } from 'nanoid';
import { supabase } from '../db/supabase.js';
import 'dotenv/config';

// Use sandbox proxy if OPENAI_BASE_URL is set in environment
const openaiConfig: { apiKey: string; baseURL?: string } = {
  apiKey: process.env.OPENAI_API_KEY ?? '',
};
if (process.env.OPENAI_BASE_URL) {
  openaiConfig.baseURL = process.env.OPENAI_BASE_URL;
}
const openai = new OpenAI(openaiConfig);
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

export interface GapFinding {
  id: string;
  wsp_id: string;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  rule_reference: string;
  action_required: string;
}

/**
 * Run gap analysis between a FINRA rule and the current WSP manual text.
 * Persists findings to the wsp_gap_findings table and returns them.
 */
export async function analyzeGaps(
  wspId: string,
  wspTitle: string,
  wspText: string,
  finraRuleNumber: string,
  finraRuleTitle: string,
  finraRuleText: string
): Promise<GapFinding[]> {
  console.log(`[GapAnalysis] Analyzing WSP "${wspTitle}" against FINRA Rule ${finraRuleNumber}...`);

  const systemPrompt = `You are a senior FINRA compliance expert specializing in broker-dealer Written Supervisory Procedures (WSPs). 
Your task is to identify compliance gaps between a firm's existing WSP section and the current FINRA rule requirements.
Respond ONLY with a valid JSON array of gap findings. Do not include any explanation outside the JSON.`;

  const userPrompt = `## FINRA Rule: ${finraRuleNumber} — ${finraRuleTitle}
${finraRuleText}

## Firm WSP Section: ${wspTitle}
${wspText || '(No WSP text provided — treat as completely missing coverage)'}

Identify all compliance gaps. For each gap, return a JSON object with these exact fields:
- "category": string (e.g., "Reg BI", "AML", "Cybersecurity", "Account Management", "Supervisory Controls")
- "severity": "High" | "Medium" | "Low"
- "title": string (concise gap title, max 80 chars)
- "description": string (clear explanation of the gap, 1-3 sentences)
- "rule_reference": string (specific rule/section reference, e.g., "FINRA Rule 2111(a)")
- "action_required": string (specific remediation step, 1-2 sentences)

Return an empty array [] if no gaps are found.`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  let rawContent = completion.choices[0].message.content ?? '{"gaps":[]}';

  // Handle both {"gaps": [...]} and direct array responses
  let parsed: any;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    console.error('[GapAnalysis] Failed to parse LLM response:', rawContent);
    return [];
  }

  const findings: any[] = Array.isArray(parsed) ? parsed : (parsed.gaps ?? parsed.findings ?? []);

  if (!findings.length) {
    console.log(`[GapAnalysis] No gaps found for WSP "${wspTitle}" against Rule ${finraRuleNumber}`);
    return [];
  }

  // Map to DB schema and persist
  const rows: GapFinding[] = findings.map((f: any) => ({
    id: `gap-${nanoid(8)}`,
    wsp_id: wspId,
    category: f.category ?? 'General',
    severity: (['High', 'Medium', 'Low'].includes(f.severity) ? f.severity : 'Medium') as GapFinding['severity'],
    title: f.title ?? 'Untitled Gap',
    description: f.description ?? '',
    rule_reference: f.rule_reference ?? finraRuleNumber,
    action_required: f.action_required ?? '',
  }));

  const { error } = await supabase.from('wsp_gap_findings').insert(rows);
  if (error) {
    console.error('[GapAnalysis] DB insert error:', error.message);
  } else {
    console.log(`[GapAnalysis] Persisted ${rows.length} gap findings for WSP "${wspTitle}"`);
  }

  return rows;
}

/**
 * Generate a plain-English summary of a FINRA regulatory notice for the alert feed.
 */
export async function summarizeRegulatoryNotice(
  ruleNumber: string,
  ruleTitle: string,
  ruleText: string
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a compliance analyst. Summarize FINRA regulatory notices in 2-3 clear sentences for a compliance officer audience.',
      },
      {
        role: 'user',
        content: `Summarize this FINRA rule update:\n\nRule ${ruleNumber}: ${ruleTitle}\n\n${ruleText.substring(0, 3000)}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 200,
  });

  return completion.choices[0].message.content ?? ruleTitle;
}
