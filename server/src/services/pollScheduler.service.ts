import cron from 'node-cron';
import { nanoid } from 'nanoid';
import { fetchRecentNotifications, fetchRulebookEntry } from './finra.service.js';
import { summarizeRegulatoryNotice } from './gapAnalysis.service.js';
import { supabase } from '../db/supabase.js';

// Map FINRA rule numbers to the most relevant WSP manual IDs
const RULE_TO_WSP_MAP: Record<string, string> = {
  '2111': 'wsp-005', // Reg BI & Suitability
  '3310': 'wsp-002', // AML
  '4370': 'wsp-008', // Cybersecurity
  '3110': 'wsp-010', // Supervisory Control System
  '4511': 'wsp-007', // Books & Records
  '4512': 'wsp-003', // Customer Account Management
  '2010': 'wsp-001', // General Standards & Ethics
};

/**
 * Poll the FINRA Notification API for new rulebook updates,
 * create FINRA alerts in the database, and log the results.
 */
export async function pollFINRANotifications(): Promise<void> {
  console.log('[PollSched] Running FINRA notification poll...');

  try {
    const notifications = await fetchRecentNotifications();
    console.log(`[PollSched] Received ${notifications.length} notifications from FINRA`);

    for (const notification of notifications) {
      const ruleNumber: string = notification.ruleNumber ?? notification.rule_number ?? '';
      const ruleTitle: string  = notification.ruleTitle  ?? notification.rule_title  ?? 'Regulatory Update';
      const ruleText: string   = notification.ruleText   ?? notification.rule_text   ?? notification.description ?? '';

      if (!ruleNumber) continue;

      // Check if we already have this alert (dedup by rule + received_at date)
      const { data: existing } = await supabase
        .from('finra_alerts')
        .select('id')
        .eq('rule', `FINRA Rule ${ruleNumber}`)
        .gte('received_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`[PollSched] Skipping duplicate alert for Rule ${ruleNumber}`);
        continue;
      }

      // Generate LLM summary
      const summary = await summarizeRegulatoryNotice(ruleNumber, ruleTitle, ruleText);

      const manualId = RULE_TO_WSP_MAP[ruleNumber] ?? null;
      const severity = determineSeverity(ruleNumber, ruleTitle);

      const { error } = await supabase.from('finra_alerts').insert({
        id: `alert-${nanoid(8)}`,
        manual_id: manualId,
        severity,
        rule: `FINRA Rule ${ruleNumber}`,
        summary,
        detail: ruleText.substring(0, 1000) || summary,
        source: 'FINRA Notification API',
        affected_section: manualId ? `WSP Manual ${manualId}` : null,
        raw_payload: notification,
      });

      if (error) {
        console.error(`[PollSched] Failed to insert alert for Rule ${ruleNumber}:`, error.message);
      } else {
        console.log(`[PollSched] Created FINRA alert for Rule ${ruleNumber} (${severity})`);
      }
    }
  } catch (err: any) {
    console.error('[PollSched] FINRA poll failed:', err.message);
  }
}

/**
 * Determine alert severity based on rule number and title keywords.
 */
function determineSeverity(ruleNumber: string, ruleTitle: string): 'High' | 'Medium' | 'Low' {
  const highPriorityRules = ['2111', '3310', '4370', '3120'];
  const titleLower = ruleTitle.toLowerCase();

  if (highPriorityRules.includes(ruleNumber)) return 'High';
  if (titleLower.includes('immediate') || titleLower.includes('critical') || titleLower.includes('required')) return 'High';
  if (titleLower.includes('update') || titleLower.includes('amendment') || titleLower.includes('guidance')) return 'Medium';
  return 'Low';
}

/**
 * Start the polling scheduler.
 * Runs every 6 hours in production; every 30 minutes in development.
 */
export function startPollScheduler(): void {
  const schedule = process.env.NODE_ENV === 'production' ? '0 */6 * * *' : '*/30 * * * *';

  cron.schedule(schedule, async () => {
    await pollFINRANotifications();
  });

  console.log(`[PollSched] Scheduler started — polling FINRA every ${process.env.NODE_ENV === 'production' ? '6 hours' : '30 minutes'}`);

  // Run once immediately on startup
  setTimeout(pollFINRANotifications, 5000);
}
