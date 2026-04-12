-- ============================================================
-- DMP OS WSP Management Module — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor to initialize all tables
-- ============================================================

-- 1. WSP Sub-Manuals
CREATE TABLE IF NOT EXISTS wsp_sub_manuals (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  sections      INTEGER NOT NULL DEFAULT 0,
  completion    INTEGER NOT NULL DEFAULT 0,  -- percentage 0-100
  last_updated  TEXT NOT NULL,
  supervisor    TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('Current', 'Under Review', 'Needs Update', 'Approved')),
  version       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WSP Attestations
CREATE TABLE IF NOT EXISTS wsp_attestations (
  id             TEXT PRIMARY KEY,
  wsp_id         TEXT REFERENCES wsp_sub_manuals(id) ON DELETE CASCADE,
  assignee       TEXT NOT NULL,
  role           TEXT NOT NULL,
  due_date       TEXT NOT NULL,
  status         TEXT NOT NULL CHECK (status IN ('Pending', 'Completed', 'Overdue')),
  version        TEXT NOT NULL,
  completed_date TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WSP Gap Findings (LLM-generated)
CREATE TABLE IF NOT EXISTS wsp_gap_findings (
  id              TEXT PRIMARY KEY,
  wsp_id          TEXT REFERENCES wsp_sub_manuals(id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  rule_reference  TEXT NOT NULL,
  action_required TEXT NOT NULL,
  resolved        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FINRA Alerts (from Notification + Query API)
CREATE TABLE IF NOT EXISTS finra_alerts (
  id               TEXT PRIMARY KEY,
  manual_id        TEXT REFERENCES wsp_sub_manuals(id) ON DELETE SET NULL,
  severity         TEXT NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
  rule             TEXT NOT NULL,
  summary          TEXT NOT NULL,
  detail           TEXT NOT NULL,
  source           TEXT NOT NULL DEFAULT 'FINRA Rulebook API',
  received_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  affected_section TEXT,
  raw_payload      JSONB,
  dismissed        BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- Seed Data — mirrors the existing frontend mock data
-- ============================================================

INSERT INTO wsp_sub_manuals (id, title, sections, completion, last_updated, supervisor, status, version)
VALUES
  ('wsp-001', 'General Standards & Ethics',        12, 100, '2024-01-15', 'Sarah Mitchell',   'Current',      'v3.2'),
  ('wsp-002', 'Anti-Money Laundering (AML)',        18, 87,  '2024-02-20', 'Robert Chen',      'Under Review', 'v2.8'),
  ('wsp-003', 'Customer Account Management',        24, 72,  '2024-01-30', 'Jennifer Walsh',   'Needs Update', 'v4.1'),
  ('wsp-004', 'Trading & Order Execution',          31, 95,  '2024-03-01', 'Michael Torres',   'Approved',     'v5.0'),
  ('wsp-005', 'Reg BI & Suitability',               15, 60,  '2024-02-10', 'Lisa Anderson',    'Needs Update', 'v1.9'),
  ('wsp-006', 'Communications & Marketing',         9,  100, '2024-01-20', 'David Park',       'Current',      'v2.5'),
  ('wsp-007', 'Books & Records Maintenance',        21, 88,  '2024-02-28', 'Amanda Foster',    'Under Review', 'v3.7'),
  ('wsp-008', 'Cybersecurity & Data Protection',   16, 45,  '2024-01-10', 'Kevin Martinez',   'Needs Update', 'v1.3'),
  ('wsp-009', 'Business Continuity Planning',       11, 92,  '2024-03-05', 'Rachel Thompson',  'Approved',     'v2.1'),
  ('wsp-010', 'Supervisory Control System',         28, 78,  '2024-02-15', 'James Wilson',     'Under Review', 'v4.4')
ON CONFLICT (id) DO NOTHING;

INSERT INTO wsp_attestations (id, wsp_id, assignee, role, due_date, status, version, completed_date)
VALUES
  ('att-001', 'wsp-001', 'Sarah Mitchell',  'Chief Compliance Officer', '2024-03-31', 'Completed', 'v3.2', '2024-03-15'),
  ('att-002', 'wsp-001', 'Robert Chen',     'Senior Compliance Analyst','2024-03-31', 'Completed', 'v3.2', '2024-03-18'),
  ('att-003', 'wsp-002', 'Jennifer Walsh',  'Compliance Manager',       '2024-04-15', 'Pending',   'v2.8', NULL),
  ('att-004', 'wsp-003', 'Michael Torres',  'Branch Manager',           '2024-03-15', 'Overdue',   'v4.1', NULL),
  ('att-005', 'wsp-004', 'Lisa Anderson',   'Trading Supervisor',       '2024-04-30', 'Pending',   'v5.0', NULL),
  ('att-006', 'wsp-005', 'David Park',      'Registered Rep',           '2024-03-20', 'Overdue',   'v1.9', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO wsp_gap_findings (id, wsp_id, category, severity, title, description, rule_reference, action_required)
VALUES
  ('gap-001', 'wsp-005', 'Reg BI',    'High',   'Missing Best Interest Documentation',
   'Current WSP lacks specific documentation requirements for Reg BI best interest determinations for complex products.',
   'FINRA Rule 2111 / SEC Reg BI', 'Update Section 4.2 to include mandatory documentation checklist for all product recommendations.'),
  ('gap-002', 'wsp-008', 'Cybersecurity', 'High', 'Incident Response Timeline Not Defined',
   'WSP does not specify required response timelines for cybersecurity incidents as required by FINRA Rule 4370.',
   'FINRA Rule 4370', 'Add specific timeline requirements: 24-hour internal notification, 72-hour regulatory reporting.'),
  ('gap-003', 'wsp-003', 'Account Management', 'Medium', 'Customer Identification Program Update Required',
   'CIP procedures need updating to reflect FinCEN beneficial ownership requirements effective 2024.',
   'FinCEN Rule 31 CFR 1010.230', 'Revise Section 2.1 to include beneficial ownership verification for legal entity customers.'),
  ('gap-004', 'wsp-002', 'AML',       'Medium', 'SAR Filing Threshold Clarification',
   'Current WSP language is ambiguous regarding SAR filing thresholds for structured transactions.',
   'Bank Secrecy Act / FINRA Rule 3310', 'Clarify SAR filing thresholds and add examples of structuring red flags.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO finra_alerts (id, manual_id, severity, rule, summary, detail, source, affected_section)
VALUES
  ('alert-001', 'wsp-005', 'High',   'FINRA Rule 2111',
   'Reg BI Compliance Update Required',
   'FINRA has issued updated guidance on Reg BI documentation requirements. Firms must update WSPs to reflect new best interest standard documentation by Q2 2024.',
   'FINRA Regulatory Notice 24-02', 'Section 4: Suitability & Reg BI'),
  ('alert-002', 'wsp-008', 'High',   'FINRA Rule 4370',
   'Cybersecurity Incident Response Update',
   'New FINRA cybersecurity guidance requires firms to update incident response procedures with specific timeline requirements.',
   'FINRA Regulatory Notice 24-05', 'Section 8: Cybersecurity Procedures'),
  ('alert-003', 'wsp-002', 'Medium', 'FINRA Rule 3310',
   'AML Program Enhancement Required',
   'Updated FinCEN guidance on beneficial ownership requires firms to enhance AML customer due diligence procedures.',
   'FINRA Regulatory Notice 24-01', 'Section 2: AML Procedures')
ON CONFLICT (id) DO NOTHING;
