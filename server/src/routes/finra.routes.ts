import { Router, Request, Response } from 'express';
import axios from 'axios';
import { fetchRulebookEntry, fetchWSPRelevantRules, getFINRAToken } from '../services/finra.service.js';

const router = Router();
const FINRA_BASE_URL = process.env.FINRA_BASE_URL ?? 'https://api.finra.org';

/**
 * GET /api/finra/health
 * Returns per-API connection status for all four FINRA API endpoints.
 * Tests each endpoint independently so the UI can show granular status dots.
 */
router.get('/health', async (_req: Request, res: Response) => {
  const status = {
    backend: false,       // OAuth + general connectivity
    rulebook: false,      // Query API - finraRulebook dataset
    notification: false,  // Notification API - finrarulebook event type
    registration: false,  // Registration API - branchList dataset
    lastSync: new Date().toISOString(),
    error: null as string | null,
  };

  try {
    const token = await getFINRAToken();
    status.backend = true;

    // Test Rulebook API (requires finraRulebook dataset entitlement)
    try {
      const r = await axios.post(
        `${FINRA_BASE_URL}/data/group/finra/name/finraRulebook`,
        { limit: 1, fields: ['ruleNumber', 'ruleTitle'] },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      status.rulebook = r.status === 200;
    } catch { status.rulebook = false; }

    // Test Notification API (requires finra/finrarulebook notification entitlement)
    try {
      const r = await axios.get(
        `${FINRA_BASE_URL}/notifications/group/finra/event-type/finrarulebook`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      status.notification = r.status === 200;
    } catch { status.notification = false; }

    // Test Registration API (requires registration dataset entitlement)
    try {
      const r = await axios.get(
        `${FINRA_BASE_URL}/data/group/registration/name/branchList`,
        { headers: { Authorization: `Bearer ${token}` }, params: { limit: 1 } }
      );
      status.registration = r.status === 200;
    } catch { status.registration = false; }

    return res.json({ connected: true, ...status });
  } catch (err: any) {
    status.error = err.message;
    return res.status(502).json({ connected: false, ...status });
  }
});

/**
 * POST /api/finra/poll
 * Manually trigger a FINRA notification poll.
 */
router.post('/poll', async (_req: Request, res: Response) => {
  try {
    const { pollFINRANotifications } = await import('../services/pollScheduler.service.js');
    await pollFINRANotifications();
    return res.json({ polled: true, new_alerts: 0 });
  } catch (err: any) {
    return res.status(502).json({ polled: false, error: err.message });
  }
});

/**
 * GET /api/finra/rules/:ruleNumber
 * Fetch a specific FINRA rule by number.
 */
router.get('/rules/:ruleNumber', async (req: Request, res: Response) => {
  try {
    const data = await fetchRulebookEntry(req.params.ruleNumber);
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({ error: err.message });
  }
});

/**
 * GET /api/finra/rules
 * Fetch all WSP-relevant FINRA rules.
 */
router.get('/rules', async (_req: Request, res: Response) => {
  try {
    const data = await fetchWSPRelevantRules();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({ error: err.message });
  }
});

export default router;
