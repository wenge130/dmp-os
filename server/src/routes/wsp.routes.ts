import { Router, Request, Response } from 'express';
import multer from 'multer';
import { supabase } from '../db/supabase.js';
import { uploadDocument, listDocuments, deleteDocument } from '../services/storj.service.js';
import { analyzeGaps } from '../services/gapAnalysis.service.js';
import { fetchRulebookEntry } from '../services/finra.service.js';
import { pollFINRANotifications } from '../services/pollScheduler.service.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ─── WSP Sub-Manuals ──────────────────────────────────────────────────────────

router.get('/manuals', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('wsp_sub_manuals')
    .select('*')
    .order('title');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.get('/manuals/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('wsp_sub_manuals')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Manual not found' });
  return res.json(data);
});

router.patch('/manuals/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('wsp_sub_manuals')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// ─── Attestations ─────────────────────────────────────────────────────────────

router.get('/attestations', async (req: Request, res: Response) => {
  let query = supabase.from('wsp_attestations').select('*').order('due_date');
  if (req.query.wsp_id) query = query.eq('wsp_id', req.query.wsp_id as string);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.patch('/attestations/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('wsp_attestations')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// ─── Gap Findings ─────────────────────────────────────────────────────────────

router.get('/gaps', async (req: Request, res: Response) => {
  let query = supabase.from('wsp_gap_findings').select('*').order('created_at', { ascending: false });
  if (req.query.wsp_id) query = query.eq('wsp_id', req.query.wsp_id as string);
  if (req.query.severity) query = query.eq('severity', req.query.severity as string);
  if (req.query.resolved !== undefined) query = query.eq('resolved', req.query.resolved === 'true');
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.patch('/gaps/:id/resolve', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('wsp_gap_findings')
    .update({ resolved: true, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Built-in FINRA rule summaries for PoC (used when Rulebook API access is not yet provisioned)
const FINRA_RULE_SUMMARIES: Record<string, { title: string; text: string }> = {
  '2010': { title: 'Standards of Commercial Honor and Principles of Trade', text: 'Members must observe high standards of commercial honor and just and equitable principles of trade in the conduct of their business.' },
  '2111': { title: 'Suitability / Reg BI', text: 'A member or associated person must have a reasonable basis to believe that a recommended transaction or investment strategy involving a security or securities is suitable for the customer. Under Reg BI, broker-dealers must act in the best interest of the retail customer at the time the recommendation is made, without placing the financial or other interest of the broker-dealer ahead of the interest of the retail customer. Firms must document the basis for each recommendation and maintain records of the customer\'s investment profile.' },
  '2112': { title: 'Customers\' Securities', text: 'Members must promptly deliver securities to customers and maintain proper custody of customer securities.' },
  '3110': { title: 'Supervision', text: 'Each member shall establish and maintain a system to supervise the activities of each associated person that is reasonably designed to achieve compliance with applicable securities laws and regulations, and with applicable FINRA rules. Final responsibility for proper supervision shall rest with the member. A member\'s supervisory system shall provide, at a minimum, for established written procedures for supervision, designation of supervisors, and review of correspondence and customer accounts.' },
  '3120': { title: 'Supervisory Control System', text: 'Each member must designate and specifically identify to FINRA one or more principals who shall establish, maintain, and enforce a system of supervisory control policies and procedures. The member must conduct an annual review of the business in which it engages to determine compliance with applicable securities laws and regulations.' },
  '3310': { title: 'Anti-Money Laundering Compliance Program', text: 'Each member shall develop and implement a written anti-money laundering program reasonably designed to achieve and monitor the member\'s compliance with the requirements of the Bank Secrecy Act and the implementing regulations promulgated thereunder. The AML program must include policies and procedures for customer identification, suspicious activity reporting (SAR), and beneficial ownership verification for legal entity customers per FinCEN Rule 31 CFR 1010.230.' },
  '4370': { title: 'Business Continuity Plans and Emergency Contact Information', text: 'Each member must create and maintain a written business continuity plan identifying procedures relating to an emergency or significant business disruption. The plan must address data backup and recovery, mission critical systems, financial and operational assessments, alternate communications, regulatory reporting, and customer communication. Members must also establish incident response procedures with specific timelines: 24-hour internal notification and 72-hour regulatory reporting for cybersecurity incidents.' },
  '4511': { title: 'General Requirements for Books and Records', text: 'Each member shall make and preserve books and records as required under the FINRA rules, the Exchange Act and the applicable Exchange Act rules. Records must be maintained in a readily accessible place for a period of not less than six years.' },
  '4512': { title: 'Customer Account Information', text: 'Members must make reasonable efforts to obtain and maintain essential customer account information including customer name, tax identification number, address, telephone number, date of birth, employment status, annual income, net worth, and investment objectives.' },
};

/**
 * POST /api/wsp/gaps/analyze
 * Trigger LLM gap analysis for a specific WSP manual against a FINRA rule.
 * Body: { wsp_id, rule_number, rule_title?, rule_text? }
 * Note: If FINRA Rulebook API is not yet provisioned, uses built-in rule summaries.
 */
router.post('/gaps/analyze', async (req: Request, res: Response) => {
  const { wsp_id, rule_number, rule_title: customTitle, rule_text: customText } = req.body;
  if (!wsp_id || !rule_number) {
    return res.status(400).json({ error: 'wsp_id and rule_number are required' });
  }

  // Fetch WSP manual metadata
  const { data: manual, error: manualError } = await supabase
    .from('wsp_sub_manuals')
    .select('*')
    .eq('id', wsp_id)
    .single();
  if (manualError) return res.status(404).json({ error: 'WSP manual not found' });

  // Try to fetch FINRA rule text; fall back to built-in summaries if not permitted
  let ruleTitle = customTitle ?? `FINRA Rule ${rule_number}`;
  let ruleText = customText ?? '';

  try {
    const ruleData = await fetchRulebookEntry(rule_number);
    const rule = Array.isArray(ruleData) ? ruleData[0] : ruleData;
    if (rule) {
      ruleTitle = rule.ruleTitle ?? ruleTitle;
      ruleText = rule.ruleText ?? ruleText;
    }
  } catch (err: any) {
    // Fall back to built-in rule summaries for PoC
    const builtin = FINRA_RULE_SUMMARIES[rule_number];
    if (builtin) {
      ruleTitle = builtin.title;
      ruleText = builtin.text;
      console.log(`[WSP] Using built-in rule summary for Rule ${rule_number} (FINRA API not yet provisioned)`);
    } else if (!ruleText) {
      return res.status(502).json({ error: `FINRA API error: ${err.message}. Provide rule_text in request body to bypass.` });
    }
  }

  // Run gap analysis
  const findings = await analyzeGaps(
    wsp_id,
    manual.title,
    '', // WSP text would come from Storj in full implementation
    rule_number,
    ruleTitle,
    ruleText
  );

  return res.json({ analyzed: true, findings_count: findings.length, findings, rule_source: ruleText ? 'finra_api' : 'builtin_summary' });
});

// ─── FINRA Alerts ─────────────────────────────────────────────────────────────

router.get('/alerts', async (req: Request, res: Response) => {
  let query = supabase
    .from('finra_alerts')
    .select('*')
    .eq('dismissed', false)
    .order('received_at', { ascending: false });
  if (req.query.severity) query = query.eq('severity', req.query.severity as string);
  if (req.query.manual_id) query = query.eq('manual_id', req.query.manual_id as string);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.patch('/alerts/:id/dismiss', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('finra_alerts')
    .update({ dismissed: true })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

/**
 * POST /api/wsp/alerts/poll
 * Manually trigger a FINRA notification poll (useful for testing).
 */
router.post('/alerts/poll', async (_req: Request, res: Response) => {
  try {
    await pollFINRANotifications();
    return res.json({ success: true, message: 'FINRA poll completed' });
  } catch (err: any) {
    return res.status(502).json({ error: err.message });
  }
});

// ─── Document Storage (Storj) ─────────────────────────────────────────────────

router.post('/manuals/:id/documents', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const key = await uploadDocument(
      req.params.id,
      req.file.originalname,
      req.file.buffer,
      req.file.mimetype
    );
    // Update manual's updated_at timestamp
    await supabase
      .from('wsp_sub_manuals')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', req.params.id);

    return res.json({ success: true, key, filename: req.file.originalname });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/manuals/:id/documents', async (req: Request, res: Response) => {
  try {
    const docs = await listDocuments(req.params.id);
    return res.json(docs);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/manuals/:id/documents', async (req: Request, res: Response) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'key is required' });
  try {
    await deleteDocument(key);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
