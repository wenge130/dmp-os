import axios from 'axios';
import 'dotenv/config';

const FINRA_AUTH_URL = process.env.FINRA_AUTH_URL!;
const FINRA_BASE_URL = process.env.FINRA_BASE_URL!;
const CLIENT_ID      = process.env.FINRA_CLIENT_ID!;
const CLIENT_SECRET  = process.env.FINRA_CLIENT_SECRET!;

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

/**
 * Obtain (or return cached) OAuth 2.0 access token from FINRA Identity Platform (FIP).
 */
export async function getFINRAToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.token;
  }

  // FINRA FIP OAuth2: use Basic auth (client_id:client_secret) with grant_type as query param
  const response = await axios.post(
    `${FINRA_AUTH_URL}?grant_type=client_credentials`,
    '',
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
    }
  );

  const { access_token, expires_in } = response.data;
  tokenCache = {
    token: access_token,
    expiresAt: now + (expires_in ?? 1800) * 1000,
  };

  console.log('[FINRA] Token acquired, expires in', expires_in, 'seconds');
  return access_token;
}

/**
 * Fetch the latest FINRA Rulebook entries for a given rule number or keyword.
 */
export async function fetchRulebookEntry(ruleNumber: string): Promise<any> {
  const token = await getFINRAToken();

  const response = await axios.post(
    `${FINRA_BASE_URL}/data/group/finra/name/finraRulebook`,
    {
      limit: 10,
      offset: 0,
      fields: ['ruleNumber', 'ruleTitle', 'ruleText', 'effectiveDate', 'noticeNumber'],
      domainFilters: [{ fieldName: 'ruleNumber', values: [ruleNumber] }],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

/**
 * Fetch recent FINRA regulatory notices (Notification API).
 */
export async function fetchRecentNotifications(): Promise<any[]> {
  const token = await getFINRAToken();

  const response = await axios.get(
    `${FINRA_BASE_URL}/notifications/group/finra/event-type/finrarulebook`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 20 },
    }
  );

  return response.data?.notifications ?? response.data ?? [];
}

/**
 * Fetch a broad set of rulebook entries relevant to broker-dealer WSP compliance.
 */
export async function fetchWSPRelevantRules(): Promise<any[]> {
  const token = await getFINRAToken();

  // Key rules relevant to broker-dealer WSPs
  const relevantRules = ['2010', '2111', '3110', '3120', '3310', '4370', '4511', '4512'];

  const response = await axios.post(
    `${FINRA_BASE_URL}/data/group/finra/name/finraRulebook`,
    {
      limit: 50,
      offset: 0,
      fields: ['ruleNumber', 'ruleTitle', 'ruleText', 'effectiveDate', 'noticeNumber'],
      domainFilters: [{ fieldName: 'ruleNumber', values: relevantRules }],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data ?? [];
}
