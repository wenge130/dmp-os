import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  GitBranch,
  Globe,
  Mail,
  Radio,
  Send,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StageStatus = "completed" | "active" | "pending" | "triggered";

interface LifecycleStage {
  id: string;
  date: string;
  label: string;
  sublabel: string;
  status: StageStatus;
  icon: React.ElementType;
  detail: string;
  source?: string;
  sourceUrl?: string;
  cascades?: CascadeItem[];
}

interface CascadeItem {
  team: string;
  action: string;
  icon: React.ElementType;
  status: "notified" | "pending" | "completed";
  priority: "high" | "medium" | "low";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stages: LifecycleStage[] = [
  {
    id: "filed",
    date: "Dec 29, 2025",
    label: "Proposed Rule Filed",
    sublabel: "SR-FINRA-2025-017",
    status: "completed",
    icon: FileText,
    detail:
      "FINRA filed SR-FINRA-2025-017 with the SEC proposing to amend Rule 4210 (Margin Requirements) to eliminate the $25,000 Pattern Day Trader minimum equity requirement and replace it with a new intraday margin standard.",
    source: "SEC EDGAR",
    sourceUrl: "https://www.sec.gov/rules-regulations/public-comments/sr-finra-2025-017",
  },
  {
    id: "published",
    date: "Jan 14, 2026",
    label: "Federal Register Publication",
    sublabel: "Release No. 34-104572 · 91 FR 1580",
    status: "completed",
    icon: Globe,
    detail:
      "The proposed rule change was published in the Federal Register (91 FR 1580). The public comment period opened, giving interested parties until February 4, 2026 to submit written comments to the SEC.",
    source: "Federal Register",
    sourceUrl: "https://www.federalregister.gov",
  },
  {
    id: "comment",
    date: "Jan 14 – Feb 4, 2026",
    label: "Public Comment Period",
    sublabel: "Comment window closed",
    status: "completed",
    icon: Mail,
    detail:
      "The SEC received multiple comment letters in response to the Notice. On January 28, 2026, the Commission extended the review period to April 14, 2026. FINRA responded to all comment letters on March 18, 2026.",
    source: "SEC Comment File",
    sourceUrl: "https://www.sec.gov/rules-regulations/public-comments/sr-finra-2025-017",
  },
  {
    id: "amendment",
    date: "Apr 2, 2026",
    label: "Amendment No. 1 Filed",
    sublabel: "Implementation timing update",
    status: "completed",
    icon: GitBranch,
    detail:
      "FINRA filed Amendment No. 1 to clarify the timing of implementation of the proposed rule change. The Commission published the amendment to solicit additional public comments before granting accelerated approval.",
    source: "FINRA.org",
    sourceUrl: "https://www.finra.org/sites/default/files/2026-04/FINRA-2025-017-Partial-A-1.pdf",
  },
  {
    id: "approved",
    date: "Apr 14, 2026",
    label: "SEC Accelerated Approval",
    sublabel: "Release No. 34-105226",
    status: "active",
    icon: CheckCircle2,
    detail:
      "The SEC granted accelerated approval of the proposed rule change as modified by Amendment No. 1. FINRA Rule 4210(f)(8)(B) — the Pattern Day Trader provisions including the $25,000 minimum equity requirement — is eliminated. New intraday margin standards (paragraph (d)(2)) take effect.",
    source: "SEC Release 34-105226",
    sourceUrl: "https://www.sec.gov",
    cascades: [
      {
        team: "Compliance / WSP Team",
        action: "Update PDT section in Written Supervisory Procedures to reflect elimination of $25K requirement and new intraday margin standard",
        icon: ShieldCheck,
        status: "notified",
        priority: "high",
      },
      {
        team: "Technology / Engineering",
        action: "Update codebase: remove $25,000 PDT threshold checks, implement intraday margin deficit computation logic per new Rule 4210(d)(2)",
        icon: Code2,
        status: "notified",
        priority: "high",
      },
      {
        team: "Risk Management",
        action: "Reconfigure real-time margin monitoring rules — new intraday margin deficit triggers replace PDT buying power limits",
        icon: AlertTriangle,
        status: "notified",
        priority: "high",
      },
      {
        team: "Operations",
        action: "Update margin call workflows: 5-business-day cure period and 90-day freeze procedures under new intraday standard",
        icon: Users,
        status: "notified",
        priority: "medium",
      },
      {
        team: "Client Communications",
        action: "Notify retail clients of PDT requirement elimination — customers with <$25K accounts may now day trade under intraday margin rules",
        icon: Send,
        status: "pending",
        priority: "medium",
      },
      {
        team: "Net Capital (FINOP)",
        action: "Update net capital deduction logic: intraday margin deficits unsatisfied after 5 business days must be deducted for up to 10 business days",
        icon: Zap,
        status: "pending",
        priority: "medium",
      },
    ],
  },
  {
    id: "implementation",
    date: "TBD (per FINRA notice)",
    label: "Implementation Deadline",
    sublabel: "Effective date pending FINRA announcement",
    status: "pending",
    icon: Clock,
    detail:
      "FINRA will announce the specific implementation date via Regulatory Notice. All broker-dealer WSP updates, code changes, and operational procedure revisions must be completed before this date.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusColors: Record<StageStatus, string> = {
  completed: "bg-green-500",
  active: "bg-blue-500 animate-pulse",
  pending: "bg-gray-300",
  triggered: "bg-orange-500 animate-pulse",
};

const statusRing: Record<StageStatus, string> = {
  completed: "ring-green-200 bg-green-50",
  active: "ring-blue-300 bg-blue-50",
  pending: "ring-gray-200 bg-gray-50",
  triggered: "ring-orange-200 bg-orange-50",
};

const priorityBadge: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-orange-100 text-orange-700 border-orange-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

const cascadeStatusBadge: Record<string, string> = {
  notified: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

function CascadeCard({ item }: { item: CascadeItem }) {
  const Icon = item.icon;
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:border-blue-200 transition-colors">
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-semibold text-gray-800">{item.team}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityBadge[item.priority]}`}>
            {item.priority.toUpperCase()}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ml-auto ${cascadeStatusBadge[item.status]}`}>
            {item.status === "notified" ? "🔔 Notified" : item.status === "completed" ? "✓ Done" : "⏳ Pending"}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{item.action}</p>
      </div>
    </div>
  );
}

function StageCard({ stage, isLast }: { stage: LifecycleStage; isLast: boolean }) {
  const [expanded, setExpanded] = useState(stage.status === "active");
  const Icon = stage.icon;

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 z-0" />
      )}

      {/* Icon dot */}
      <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full ring-4 flex items-center justify-center ${statusRing[stage.status]}`}>
        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[stage.status]}`} />
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stage.date}</span>
                {stage.status === "active" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    CURRENT
                  </span>
                )}
                {stage.status === "pending" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                    UPCOMING
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{stage.label}</h3>
              <p className="text-xs text-gray-500">{stage.sublabel}</p>
            </div>
            <div className="shrink-0 mt-1 text-gray-400">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
              {stage.detail}
            </p>

            {stage.sourceUrl && (
              <a
                href={stage.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <ExternalLink className="h-3 w-3" />
                {stage.source}
              </a>
            )}

            {stage.cascades && stage.cascades.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Downstream Cascade — {stage.cascades.length} teams notified
                  </span>
                </div>
                <div className="space-y-2">
                  {stage.cascades.map((c, i) => (
                    <CascadeCard key={i} item={c} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PDTLifecycle() {
  const completedCount = stages.filter((s) => s.status === "completed").length;
  const totalCount = stages.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Regulatory Lifecycle Tracker
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            FINRA Rule 4210 — PDT Margin Reform
          </h1>
          <p className="text-sm text-gray-500">
            SR-FINRA-2025-017 · Filed Dec 29, 2025 · SEC Approved Apr 14, 2026
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">Rule Status</p>
            <p className="text-lg font-bold text-green-800">Approved</p>
            <p className="text-xs text-green-600 mt-0.5">Apr 14, 2026</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">Lifecycle Progress</p>
            <p className="text-lg font-bold text-blue-800">{progressPct}%</p>
            <p className="text-xs text-blue-600 mt-0.5">{completedCount} of {totalCount} stages</p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1">Teams Notified</p>
            <p className="text-lg font-bold text-orange-800">6</p>
            <p className="text-xs text-orange-600 mt-0.5">Cascade triggered</p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-1">Key Change</p>
            <p className="text-lg font-bold text-purple-800">$25K → $0</p>
            <p className="text-xs text-purple-600 mt-0.5">PDT min. equity removed</p>
          </div>
        </div>

        {/* Rule change summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">What Changed</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-red-50 border border-red-100 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">Before — Old Rule 4210(f)(8)(B)</p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">✕</span> $25,000 minimum equity required for Pattern Day Traders</li>
                <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">✕</span> "Pattern Day Trader" designation after 4+ day trades in 5 days</li>
                <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">✕</span> Day-trading buying power limits (4× equity for equities)</li>
                <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">✕</span> 90-day cash-only restriction if margin call unmet in 5 days</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-100 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-2">After — New Rule 4210(d)(2)</p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span> No minimum equity requirement — PDT designation eliminated</li>
                <li className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span> Intraday margin deficit computed in real-time or end-of-day</li>
                <li className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span> Members may block trades that would create intraday deficits</li>
                <li className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">✓</span> 5-day cure period; 90-day freeze if customer habitually fails</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Regulatory Lifecycle</span>
          </div>
          <div>
            {stages.map((stage, i) => (
              <StageCard key={stage.id} stage={stage} isLast={i === stages.length - 1} />
            ))}
          </div>
        </div>

        {/* Audit trail footer */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Audit Trail</span>
          </div>
          <div className="space-y-1 text-xs text-gray-500 font-mono">
            <div>[Dec 29, 2025 09:14 EST] ALERT DETECTED — SR-FINRA-2025-017 filed with SEC</div>
            <div>[Jan 14, 2026 08:45 EST] MONITORING — Published in Federal Register 91 FR 1580</div>
            <div>[Jan 28, 2026 14:22 EST] UPDATE — SEC extended review period to Apr 14, 2026</div>
            <div>[Mar 18, 2026 11:03 EST] UPDATE — FINRA responded to public comment letters</div>
            <div>[Apr 02, 2026 15:30 EST] AMENDMENT — Amendment No. 1 filed; implementation timing updated</div>
            <div className="text-blue-600 font-semibold">[Apr 14, 2026 10:00 EST] APPROVED — SEC granted accelerated approval · Release 34-105226</div>
            <div className="text-orange-600">[Apr 14, 2026 10:01 EST] CASCADE — 6 downstream teams notified automatically</div>
            <div className="text-orange-600">[Apr 14, 2026 10:01 EST] ALERT SENT — WSP Team: update PDT section in Rule 4210 procedures</div>
            <div className="text-orange-600">[Apr 14, 2026 10:01 EST] ALERT SENT — Engineering: remove $25K threshold from codebase</div>
          </div>
        </div>

      </div>
    </div>
  );
}
