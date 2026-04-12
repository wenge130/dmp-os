import { Router, Request, Response } from 'express';
import { fetchRulebookEntry, fetchWSPRelevantRules, getFINRAToken } from '../services/finra.service.js';

const router = Router();

/**
 * GET /api/finra/health
 * Verify FINRA API connectivity by acquiring a token.
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const token = await getFINRAToken();
    return res.json({ connected: true, token_preview: token.substring(0, 20) + '...' });
  } catch (err: any) {
    return res.status(502).json({ connected: false, error: err.message });
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
