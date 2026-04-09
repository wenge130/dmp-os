import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Search, Plus, Download, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, ChevronDown, Edit2, Send, Shield,
  BookOpen, Users, BarChart2, ArrowLeft, RefreshCw, Bell,
  CheckSquare, XCircle, Eye, History, Upload, Zap, Tag,
  AlertCircle, FileCheck, UserCheck, Calendar, Hash, Lock,
  ExternalLink, MessageSquare, Save, MoreHorizontal, Radio,
  GitBranch, Award, Smartphone, Palette, Globe, Activity,
  Wifi, Database, Link2, Building2, Star, ChevronUp,
  ToggleLeft, ToggleRight, Info, Layers, Settings
} from "lucide-react";
import { ChatInput } from "@/components/ChatInput";

// ─── Types ───────────────────────────────────────────────────────────────────

type View =
  | "library"
  | "editor"
  | "attestation"
  | "gap-analysis"
  | "rule-monitor"
  | "cross-module"
  | "branch-wsp"
  | "cert-wizard"
  | "white-label";

interface SubManual {
  id: string;
  title: string;
  sections: number;
  completion: number;
  lastUpdated: string;
  supervisor: string;
  status: "Current" | "Needs Review" | "Overdue";
  version: string;
}

interface AttestationRow {
  id: string;
  wsp: string;
  assignee: string;
  role: string;
  dueDate: string;
  status: "Completed" | "Pending" | "Overdue";
  version: string;
  completedDate?: string;
}

interface GapFinding {
  id: string;
  category: "Missing" | "Outdated" | "Reg BI" | "Recommended";
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  rule: string;
  wsp: string;
  action: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const subManuals: SubManual[] = [
  { id: "gs", title: "General Supervision", sections: 12, completion: 100, lastUpdated: "Apr 1, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v3.2" },
  { id: "rb", title: "Retail Brokerage", sections: 18, completion: 88, lastUpdated: "Mar 28, 2026", supervisor: "James Whitfield", status: "Needs Review", version: "v2.9" },
  { id: "aml", title: "AML / CIP / CDD", sections: 15, completion: 100, lastUpdated: "Apr 2, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v4.1" },
  { id: "comm", title: "Communications Supervision", sections: 9, completion: 67, lastUpdated: "Feb 14, 2026", supervisor: "Dana Park", status: "Overdue", version: "v1.8" },
  { id: "rk", title: "Recordkeeping", sections: 11, completion: 100, lastUpdated: "Mar 15, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v2.5" },
  { id: "hs", title: "Heightened Supervision", sections: 7, completion: 71, lastUpdated: "Jan 30, 2026", supervisor: "James Whitfield", status: "Needs Review", version: "v1.3" },
  { id: "regbi", title: "Regulation Best Interest", sections: 14, completion: 93, lastUpdated: "Apr 3, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v2.0" },
  { id: "da", title: "Digital Assets", sections: 6, completion: 50, lastUpdated: "Mar 5, 2026", supervisor: "Unassigned", status: "Needs Review", version: "v0.9" },
];

const attestations: AttestationRow[] = [
  { id: "a1", wsp: "General Supervision", assignee: "James Whitfield", role: "Branch Manager", dueDate: "Apr 10, 2026", status: "Pending", version: "v3.2" },
  { id: "a2", wsp: "Retail Brokerage", assignee: "Dana Park", role: "Dept. Head", dueDate: "Apr 8, 2026", status: "Overdue", version: "v2.9" },
  { id: "a3", wsp: "AML / CIP / CDD", assignee: "James Whitfield", role: "Branch Manager", dueDate: "Apr 5, 2026", status: "Completed", version: "v4.1", completedDate: "Apr 4, 2026" },
  { id: "a4", wsp: "Regulation Best Interest", assignee: "Marcus Lee", role: "Supervisor", dueDate: "Apr 12, 2026", status: "Pending", version: "v2.0" },
  { id: "a5", wsp: "Recordkeeping", assignee: "Dana Park", role: "Dept. Head", dueDate: "Apr 3, 2026", status: "Completed", version: "v2.5", completedDate: "Apr 2, 2026" },
  { id: "a6", wsp: "Communications Supervision", assignee: "Marcus Lee", role: "Supervisor", dueDate: "Mar 31, 2026", status: "Overdue", version: "v1.8" },
  { id: "a7", wsp: "Heightened Supervision", assignee: "Sarah Chen", role: "CCO", dueDate: "Apr 15, 2026", status: "Pending", version: "v1.3" },
];

const gapFindings: GapFinding[] = [
  {
    id: "g1", category: "Missing", severity: "High",
    title: "No procedure for digital asset suitability review",
    description: "FINRA Rule 3110(b) requires specific supervisory procedures for each business activity. Digital asset suitability is not addressed in any current sub-manual.",
    rule: "FINRA Rule 3110(b)", wsp: "Digital Assets", action: "Draft new section 6.3 covering digital asset suitability review and approval workflow."
  },
  {
    id: "g2", category: "Outdated", severity: "High",
    title: "Communications Supervision references superseded FINRA Rule 2210",
    description: "Section 3.1 of Communications Supervision cites FINRA Rule 2210 as amended in 2021. The 2023 amendment (effective Jan 2024) introduced new digital communications requirements not reflected here.",
    rule: "FINRA Rule 2210 (2023 Amendment)", wsp: "Communications Supervision", action: "Update section 3.1 to incorporate 2023 digital communications requirements."
  },
  {
    id: "g3", category: "Reg BI", severity: "High",
    title: "Reg BI conflict of interest disclosure procedure incomplete",
    description: "SEC 2026 Examination Priorities cite inadequate conflict-of-interest disclosure as a primary Reg BI deficiency. Current Reg BI sub-manual section 4.2 lacks a documented escalation path for identified conflicts.",
    rule: "SEC Reg BI, 17 CFR § 240.15l-1(a)(2)(ii)(C)", wsp: "Regulation Best Interest", action: "Add escalation workflow to section 4.2 with named supervisory contacts and timelines."
  },
  {
    id: "g4", category: "Missing", severity: "Medium",
    title: "No annual review procedure for Heightened Supervision plan",
    description: "FINRA Rule 3110(f) requires annual review and update of heightened supervision plans. No such review procedure exists in the current Heightened Supervision sub-manual.",
    rule: "FINRA Rule 3110(f)", wsp: "Heightened Supervision", action: "Add section 7.1 documenting the annual review cadence, responsible party, and sign-off requirements."
  },
  {
    id: "g5", category: "Outdated", severity: "Medium",
    title: "AML CDD threshold references pre-2024 FinCEN guidance",
    description: "Section 8.2 of the AML sub-manual references FinCEN's 2016 CDD Rule. FinCEN's 2024 beneficial ownership reporting rule under the CTA introduces new verification requirements.",
    rule: "FinCEN CTA Beneficial Ownership Rule (2024)", wsp: "AML / CIP / CDD", action: "Update section 8.2 to incorporate CTA beneficial ownership verification requirements effective Jan 1, 2024."
  },
  {
    id: "g6", category: "Reg BI", severity: "Medium",
    title: "Retail Brokerage lacks Reg BI product recommendation documentation requirement",
    description: "SEC 2026 Exam Priorities specifically call out failure to document the basis for product recommendations. Retail Brokerage section 5.4 does not require written documentation of the recommendation rationale.",
    rule: "SEC Reg BI, 17 CFR § 240.15l-1(a)(1)", wsp: "Retail Brokerage", action: "Amend section 5.4 to require written documentation of recommendation basis for each client interaction."
  },
  {
    id: "g7", category: "Recommended", severity: "Low",
    title: "Add explicit SEC Rule 17a-4 WORM storage attestation to Recordkeeping",
    description: "While the Recordkeeping sub-manual addresses retention periods, it does not explicitly attest to WORM-compliant storage. Examiners increasingly request this specific confirmation.",
    rule: "SEC Rule 17a-4(f)", wsp: "Recordkeeping", action: "Add section 11.5 confirming WORM-compliant storage vendor, configuration, and annual verification."
  },
];

const versionHistory = [
  { version: "v3.2", date: "Apr 1, 2026", user: "@sarah.chen", summary: "Updated supervisor assignment matrix per Q1 org change", hash: "a3f9c1d" },
  { version: "v3.1", date: "Mar 15, 2026", user: "@dana.park", summary: "Added section 10.3 for remote supervision procedures", hash: "b7e2a4f" },
  { version: "v3.0", date: "Feb 28, 2026", user: "@sarah.chen", summary: "Major revision: incorporated FINRA Regulatory Notice 24-02", hash: "c1d8b3e" },
  { version: "v2.9", date: "Jan 10, 2026", user: "@james.whitfield", summary: "Minor edits to section 4 escalation language", hash: "d4f7c2a" },
];

// ─── Status Badge Component ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Current": "bg-green-100 text-green-700 border-green-200",
    "Needs Review": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Overdue": "bg-red-100 text-red-700 border-red-200",
    "Completed": "bg-green-100 text-green-700 border-green-200",
    "Pending": "bg-blue-100 text-blue-700 border-blue-200",
    "High": "bg-red-100 text-red-700 border-red-200",
    "Medium": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Low": "bg-gray-100 text-gray-600 border-gray-200",
    "Missing": "bg-red-100 text-red-700 border-red-200",
    "Outdated": "bg-orange-100 text-orange-700 border-orange-200",
    "Reg BI": "bg-purple-100 text-purple-700 border-purple-200",
    "Recommended": "bg-blue-100 text-blue-700 border-blue-200",
    "Draft": "bg-gray-100 text-gray-600 border-gray-200",
    "Approved": "bg-green-100 text-green-700 border-green-200",
    "Live": "bg-green-100 text-green-700 border-green-200",
    "Triggered": "bg-red-100 text-red-700 border-red-200",
    "Monitoring": "bg-blue-100 text-blue-700 border-blue-200",
    "Paused": "bg-gray-100 text-gray-600 border-gray-200",
    "Active": "bg-green-100 text-green-700 border-green-200",
    "Inactive": "bg-gray-100 text-gray-600 border-gray-200",
    "Warning": "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

// ─── View 1: WSP Library Dashboard ───────────────────────────────────────────

function WSPLibraryView({ onOpenEditor, onOpenAttestation, onOpenGapAnalysis, onOpenRuleMonitor, onOpenCrossModule, onOpenBranchWSP, onOpenCertWizard, onOpenWhiteLabel }: {
  onOpenEditor: (id: string) => void;
  onOpenAttestation: () => void;
  onOpenGapAnalysis: () => void;
  onOpenRuleMonitor: () => void;
  onOpenCrossModule: () => void;
  onOpenBranchWSP: () => void;
  onOpenCertWizard: () => void;
  onOpenWhiteLabel: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Current" | "Needs Review" | "Overdue">("All");

  const filtered = subManuals.filter(m =>
    (filter === "All" || m.status === filter) &&
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalSections = subManuals.reduce((s, m) => s + m.sections, 0);
  const completedSections = subManuals.reduce((s, m) => s + Math.round(m.sections * m.completion / 100), 0);
  const overdueCount = subManuals.filter(m => m.status === "Overdue").length;
  const needsReviewCount = subManuals.filter(m => m.status === "Needs Review").length;
  const pendingAttestations = attestations.filter(a => a.status !== "Completed").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WSP Management</h1>
          <p className="text-muted-foreground mt-1">Written Supervisory Procedures — FINRA Rule 3110 Compliance</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenRuleMonitor}>
            <Radio className="h-4 w-4 text-green-500" /> Rule Monitor
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenCrossModule}>
            <Link2 className="h-4 w-4" /> Cross-Module
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenBranchWSP}>
            <GitBranch className="h-4 w-4" /> Branch WSPs
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenCertWizard}>
            <Award className="h-4 w-4" /> Rule 3130 Wizard
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenWhiteLabel}>
            <Palette className="h-4 w-4" /> White-Label
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenAttestation}>
            <UserCheck className="h-4 w-4" /> Attestations
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenGapAnalysis}>
            <BarChart2 className="h-4 w-4" /> Gap Analysis
          </Button>
          <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Plus className="h-4 w-4" /> New Sub-Manual
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sections Current</p>
          <p className="text-3xl font-bold mt-1">{completedSections}<span className="text-lg text-muted-foreground">/{totalSections}</span></p>
          <Progress value={(completedSections / totalSections) * 100} className="h-1 mt-2" />
        </div>
        <div className="rounded-lg border bg-red-50/50 border-red-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">Overdue</p>
          <p className="text-3xl font-bold mt-1 text-red-600">{overdueCount}</p>
          <p className="text-xs text-red-500 mt-1">sub-manuals past due</p>
        </div>
        <div className="rounded-lg border bg-yellow-50/50 border-yellow-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Needs Review</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">{needsReviewCount}</p>
          <p className="text-xs text-yellow-600 mt-1">require attention</p>
        </div>
        <div className="rounded-lg border bg-blue-50/50 border-blue-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Pending Attestations</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{pendingAttestations}</p>
          <p className="text-xs text-blue-500 mt-1">awaiting sign-off</p>
        </div>
        <div className="rounded-lg border bg-green-50/50 border-green-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Rule Monitor</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-bold text-green-600">Live · 4 APIs</p>
          </div>
          <p className="text-xs text-green-600 mt-1">Last sync: 2 min ago</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sub-manuals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex gap-1">
          {(["All", "Current", "Needs Review", "Overdue"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Manual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="rounded-lg border bg-card p-4 hover:border-foreground/20 transition-colors group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{m.title}</h3>
                    <StatusBadge status={m.status} />
                    <span className="text-[10px] font-mono text-muted-foreground">{m.version}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.sections} sections · Updated {m.lastUpdated}</p>
                  <p className="text-xs text-muted-foreground">Supervisor: {m.supervisor}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-3 w-3" /> View
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => onOpenEditor(m.id)}>
                  <Edit2 className="h-3 w-3" /> Edit
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Completion</span>
                <span className="font-semibold text-foreground">{m.completion}%</span>
              </div>
              <Progress value={m.completion} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Pre-Built Templates */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Pre-Built Templates</h3>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <ExternalLink className="h-3 w-3" /> Browse All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "FINRA Rule 3110 Full Suite", tags: ["BD", "FINRA"], icon: Shield },
            { name: "Reg BI Starter Pack", tags: ["SEC", "Retail"], icon: FileCheck },
            { name: "AML / FinCEN CTA 2024", tags: ["AML", "FinCEN"], icon: AlertTriangle },
            { name: "Digital Assets WSP Kit", tags: ["Crypto", "FINRA"], icon: Zap },
          ].map(t => (
            <div key={t.name} className="rounded border p-3 hover:border-foreground/20 transition-colors cursor-pointer group">
              <t.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-2 transition-colors" />
              <p className="text-xs font-medium text-foreground leading-snug">{t.name}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {t.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── View 2: WSP Editor ───────────────────────────────────────────────────────

function WSPEditorView({ manualId, onBack }: { manualId: string; onBack: () => void }) {
  const manual = subManuals.find(m => m.id === manualId) || subManuals[0];
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("1.1");
  const [query, setQuery] = useState("");

  const sections = [
    { id: "1", title: "Scope and Purpose", subsections: ["1.1 Firm Overview", "1.2 Business Activities Covered", "1.3 Regulatory Framework"] },
    { id: "2", title: "Supervisory Structure", subsections: ["2.1 Designated Supervisors", "2.2 Escalation Path", "2.3 Remote Supervision"] },
    { id: "3", title: "Review Procedures", subsections: ["3.1 Daily Review Requirements", "3.2 Monthly Audits", "3.3 Annual Review"] },
    { id: "4", title: "Recordkeeping", subsections: ["4.1 Retention Schedule", "4.2 WORM Compliance", "4.3 Access Controls"] },
  ];

  return (
    <div className="flex h-full min-h-screen">
      {/* Left: Section Outline */}
      <div className="w-56 shrink-0 border-r border-border bg-muted/20 flex flex-col">
        <div className="p-3 border-b border-border">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Library
          </button>
          <p className="text-xs font-semibold text-foreground truncate">{manual.title}</p>
          <p className="text-[10px] text-muted-foreground">{manual.version} · {manual.sections} sections</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {sections.map(s => (
              <div key={s.id}>
                <button
                  onClick={() => setExpandedSection(expandedSection === s.id ? null : s.id)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {expandedSection === s.id ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
                  <span className="truncate">{s.id}. {s.title}</span>
                </button>
                {expandedSection === s.id && (
                  <div className="ml-4 space-y-0.5">
                    {s.subsections.map(sub => (
                      <button key={sub} className="w-full text-left px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors truncate">
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-border space-y-1.5">
          <Button size="sm" className="w-full h-7 text-xs gap-1 bg-foreground text-background hover:bg-foreground/90">
            <Save className="h-3 w-3" /> Save Draft
          </Button>
          <Button variant="outline" size="sm" className="w-full h-7 text-xs gap-1">
            <Upload className="h-3 w-3" /> Submit for Review
          </Button>
        </div>
      </div>

      {/* Center: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/10 flex-wrap">
          {["B", "I", "U"].map(f => (
            <button key={f} className="w-7 h-7 rounded text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{f}</button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {["H1", "H2", "¶"].map(f => (
            <button key={f} className="px-2 h-7 rounded text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{f}</button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          <button className="px-2 h-7 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
            <Tag className="h-3 w-3" /> Cite Rule
          </button>
          <button className="px-2 h-7 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-500" /> AI Draft
          </button>
          <div className="ml-auto flex items-center gap-2">
            <StatusBadge status="Draft" />
            <span className="text-[10px] text-muted-foreground">Last saved 2 min ago</span>
          </div>
        </div>

        {/* Editor Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-foreground">1.1 Firm Overview</h2>
            <p className="text-sm text-foreground leading-relaxed">
              [Firm Name] ("the Firm") is a registered broker-dealer with the Financial Industry Regulatory Authority (FINRA) and the Securities and Exchange Commission (SEC). The Firm conducts retail brokerage and institutional sales activities across all registered offices and remote locations.
            </p>
            <div className="rounded border border-blue-200 bg-blue-50/50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] font-semibold text-blue-600">Regulatory Citation</span>
              </div>
              <p className="text-xs text-blue-700">FINRA Rule 3110(a): Each member shall establish and maintain a system to supervise the activities of each associated person that is reasonably designed to achieve compliance with applicable securities laws and regulations.</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              These Written Supervisory Procedures ("WSPs") are designed to ensure that all supervisory activities are conducted in accordance with applicable FINRA rules, SEC regulations, and the Firm's internal compliance policies.
            </p>

            {/* AI Draft Suggestion */}
            <div className="rounded border border-yellow-200 bg-yellow-50/30 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-[10px] font-semibold text-yellow-700">DMP AI — Suggested Addition</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                The Firm maintains a designated supervisory structure as required under FINRA Rule 3110(b), with named supervisors responsible for each business line. A complete supervisor assignment matrix is maintained in Exhibit A and reviewed annually or upon any material organizational change.
              </p>
              <div className="flex gap-1.5">
                <Button size="sm" className="h-6 text-[10px] bg-foreground text-background hover:bg-foreground/90 gap-1">
                  <CheckSquare className="h-3 w-3" /> Accept
                </Button>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1">
                  <RefreshCw className="h-3 w-3" /> Refine
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                  <XCircle className="h-3 w-3" /> Discard
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right: AI Panel */}
      <div className="w-64 shrink-0 border-l border-border flex flex-col">
        <div className="flex border-b border-border">
          {[
            { id: false, label: "AI Assistant", icon: MessageSquare },
            { id: true, label: "History", icon: History },
          ].map(tab => (
            <button
              key={String(tab.id)}
              onClick={() => setShowHistory(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded text-xs font-medium transition-colors ${showHistory === tab.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {!showHistory ? (
          <div className="flex flex-col flex-1 min-h-0">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-background">D</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-foreground leading-relaxed">
                    I'm reviewing Section 1.1. This section aligns with FINRA Rule 3110(a). I recommend adding a specific reference to the Firm's designated supervisory structure in paragraph 2.
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-secondary rounded-lg p-3 text-xs text-foreground max-w-[85%]">
                    Can you draft the scope section for a firm that does retail and institutional business?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-background">D</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-3 text-xs text-foreground leading-relaxed">
                      Draft generated for Section 1.2. It covers retail brokerage, institutional sales, and includes remote supervision language per FINRA Regulatory Notice 21-44.
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-secondary rounded text-[10px] text-muted-foreground hover:text-foreground">Insert into editor</button>
                      <button className="px-2 py-1 bg-secondary rounded text-[10px] text-muted-foreground hover:text-foreground">Refine</button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-border">
              <ChatInput query={query} setQuery={setQuery} placeholder="Ask DMP AI..." />
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Version History</p>
              {versionHistory.map((v, i) => (
                <div key={v.version} className={`rounded-lg border p-3 space-y-1.5 ${i === 0 ? "border-foreground/20 bg-muted/20" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-foreground">{v.version}</span>
                    {i === 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Current</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{v.date} · {v.user}</p>
                  <p className="text-xs text-foreground leading-snug">{v.summary}</p>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-mono text-muted-foreground">{v.hash}</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> View
                    </button>
                    {i > 0 && (
                      <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 ml-2">
                        <RefreshCw className="h-3 w-3" /> Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

// ─── View 3: Attestation Center ───────────────────────────────────────────────

function AttestationCenterView({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<"All" | "Pending" | "Overdue" | "Completed">("All");

  const filtered = attestations.filter(a => filter === "All" || a.status === filter);
  const completed = attestations.filter(a => a.status === "Completed").length;
  const pending = attestations.filter(a => a.status === "Pending").length;
  const overdue = attestations.filter(a => a.status === "Overdue").length;
  const total = attestations.length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Attestation Center</h1>
          <p className="text-muted-foreground mt-1">Track supervisor acknowledgments and WSP review completions.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
        <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90"><Plus className="h-4 w-4" /> Assign Attestation</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Assigned</p>
          <p className="text-3xl font-bold mt-1">{total}</p>
          <Progress value={(completed / total) * 100} className="h-1 mt-2" />
        </div>
        <div className="rounded-lg border bg-green-50/50 border-green-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Completed</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{completed}</p>
          <p className="text-xs text-green-600 mt-1">{Math.round((completed / total) * 100)}% completion rate</p>
        </div>
        <div className="rounded-lg border bg-blue-50/50 border-blue-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Pending</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{pending}</p>
          <p className="text-xs text-blue-500 mt-1">Awaiting review</p>
        </div>
        <div className="rounded-lg border bg-red-50/50 border-red-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">Overdue</p>
          <p className="text-3xl font-bold mt-1 text-red-600">{overdue}</p>
          <p className="text-xs text-red-500 mt-1">Past due date</p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold mb-3">Supervisor Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "James Whitfield", role: "Branch Manager", completed: 1, total: 2 },
            { name: "Dana Park", role: "Dept. Head", completed: 1, total: 2 },
            { name: "Marcus Lee", role: "Supervisor", completed: 0, total: 2 },
            { name: "Sarah Chen", role: "CCO", completed: 0, total: 1 },
          ].map(s => (
            <div key={s.name} className="rounded border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.role}</p>
                </div>
              </div>
              <Progress value={(s.completed / s.total) * 100} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">{s.completed}/{s.total} completed</p>
              {s.completed < s.total && (
                <Button variant="outline" size="sm" className="h-6 text-[10px] w-full gap-1">
                  <Bell className="h-3 w-3" /> Send Reminder
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-1">
          {(["All", "Pending", "Overdue", "Completed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b">
                {["WSP Sub-Manual", "Assignee", "Role", "Version", "Due Date", "Completed", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-4 py-3"><span className="font-medium text-foreground text-sm">{a.wsp}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {a.assignee.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm text-foreground">{a.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.role}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.version}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.dueDate}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.completedDate || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {a.status !== "Completed" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><Eye className="h-3 w-3" /> View</Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><Bell className="h-3 w-3" /> Remind</Button>
                        </>
                      )}
                      {a.status === "Completed" && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><Lock className="h-3 w-3" /> Locked</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── View 4: Gap Analysis Report ─────────────────────────────────────────────

function GapAnalysisView({ onBack }: { onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(true);
  const [filter, setFilter] = useState<"All" | "Missing" | "Outdated" | "Reg BI" | "Recommended">("All");

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setRan(true); }, 2500);
  };

  const filtered = gapFindings.filter(g => filter === "All" || g.category === filter);
  const high = gapFindings.filter(g => g.severity === "High").length;
  const medium = gapFindings.filter(g => g.severity === "Medium").length;
  const low = gapFindings.filter(g => g.severity === "Low").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Regulatory Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">AI-powered analysis against FINRA Rule 3110, SEC Reg BI, and 2026 Exam Priorities.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export as PDF</Button>
        <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90" onClick={handleRun} disabled={running}>
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
          {running ? "Analyzing..." : "Re-run Analysis"}
        </Button>
      </div>

      {ran && (
        <div className="rounded-lg border bg-muted/20 p-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs font-semibold text-foreground">Analysis Complete</p>
              <p className="text-[10px] text-muted-foreground">Apr 8, 2026 · 09:14 AM · Full WSP Library</p>
            </div>
          </div>
          <div className="h-8 border-l border-border" />
          <div className="text-center"><p className="text-lg font-bold text-red-600">{high}</p><p className="text-[10px] text-muted-foreground">High Priority</p></div>
          <div className="text-center"><p className="text-lg font-bold text-yellow-600">{medium}</p><p className="text-[10px] text-muted-foreground">Medium Priority</p></div>
          <div className="text-center"><p className="text-lg font-bold text-gray-500">{low}</p><p className="text-[10px] text-muted-foreground">Low Priority</p></div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Checked against</p>
            <p className="text-xs font-medium text-foreground">FINRA Rule 3110 · SEC Reg BI · 2026 Exam Priorities · FinCEN CTA</p>
          </div>
        </div>
      )}

      <div className="flex gap-1">
        {(["All", "Missing", "Outdated", "Reg BI", "Recommended"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
            {f}{f !== "All" && <span className="ml-1.5 text-[10px] opacity-70">({gapFindings.filter(g => g.category === f).length})</span>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(g => (
          <div key={g.id} className="rounded-lg border p-4 space-y-3 hover:border-foreground/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {g.severity === "High" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {g.severity === "Medium" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {g.severity === "Low" && <CheckCircle2 className="h-4 w-4 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusBadge status={g.category} />
                  <StatusBadge status={g.severity} />
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{g.rule}</span>
                  <span className="text-[10px] text-muted-foreground">→ {g.wsp}</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.description}</p>
              </div>
            </div>
            <div className="rounded bg-muted/40 border border-border p-3 flex items-start gap-2">
              <Zap className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-foreground mb-0.5">Recommended Action</p>
                <p className="text-xs text-muted-foreground">{g.action}</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 shrink-0">
                <ChevronRight className="h-3 w-3" /> Remediate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── View 5: Rule Monitoring Bot (FINRA Gateway) ──────────────────────────────

function RuleMonitorView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"feeds" | "alerts" | "submissions">("feeds");

  const feeds = [
    { api: "FINRA Rulebook API", endpoint: "api.finra.org/rulebook/v1", status: "Live", lastSync: "2 min ago", rules: 847, changes: 3 },
    { api: "FINRA Notification API", endpoint: "api.finra.org/notifications/v1", status: "Live", lastSync: "5 min ago", rules: 124, changes: 1 },
    { api: "FINRA Submission API", endpoint: "api.finra.org/submission/v1", status: "Live", lastSync: "1 min ago", rules: 56, changes: 0 },
    { api: "FINRA Registration API", endpoint: "api.finra.org/registration/v1", status: "Monitoring", lastSync: "12 min ago", rules: 203, changes: 0 },
  ];

  const alerts = [
    { id: "r1", severity: "High", rule: "FINRA Rule 2210", title: "Digital Communications Amendment — Effective Jan 1, 2024", description: "FINRA amended Rule 2210 to include new requirements for social media and digital communications supervision. WSP update required.", affectedWSP: "Communications Supervision", detected: "Apr 8, 2026 · 09:02 AM", status: "Triggered" },
    { id: "r2", severity: "Medium", rule: "FINRA Regulatory Notice 26-04", title: "Updated Guidance on Remote Supervision Procedures", description: "FINRA issued updated guidance on remote supervision best practices following post-pandemic hybrid work arrangements.", affectedWSP: "General Supervision", detected: "Apr 7, 2026 · 03:15 PM", status: "Triggered" },
    { id: "r3", severity: "Medium", rule: "SEC Reg BI — 2026 Exam Priorities", title: "Conflict of Interest Documentation Emphasis", description: "SEC 2026 Examination Priorities highlight inadequate conflict-of-interest documentation as a primary deficiency area.", affectedWSP: "Regulation Best Interest", detected: "Apr 5, 2026 · 11:30 AM", status: "Triggered" },
    { id: "r4", severity: "Low", rule: "FINRA Rule 3110(f)", title: "Annual Heightened Supervision Review Reminder", description: "FINRA Rule 3110(f) requires annual review of heightened supervision plans. Your review is due within 30 days.", affectedWSP: "Heightened Supervision", detected: "Apr 1, 2026 · 08:00 AM", status: "Monitoring" },
  ];

  const submissions = [
    { id: "s1", type: "FOCUS Report", period: "Q1 2026", status: "Submitted", submitted: "Apr 2, 2026", ref: "FIN-2026-Q1-04821" },
    { id: "s2", type: "Annual Certification (Rule 3130)", period: "FY 2025", status: "Pending", submitted: "—", ref: "—" },
    { id: "s3", type: "FOCUS Report", period: "Q4 2025", status: "Submitted", submitted: "Jan 3, 2026", ref: "FIN-2025-Q4-09134" },
    { id: "s4", type: "Regulatory Notice Response", period: "RN 26-04", status: "Draft", submitted: "—", ref: "—" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Rule Monitoring Bot</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 border border-green-200 text-[11px] font-semibold text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          </div>
          <p className="text-muted-foreground mt-1">Real-time FINRA gateway monitoring — Rulebook, Notification, Submission & Registration APIs.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Settings className="h-4 w-4" /> Configure Alerts</Button>
        <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90"><RefreshCw className="h-4 w-4" /> Sync Now</Button>
      </div>

      {/* API Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {feeds.map(f => (
          <div key={f.api} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <StatusBadge status={f.status} />
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">{f.api}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate">{f.endpoint}</p>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{f.rules} rules tracked</span>
              <span className="text-foreground font-medium">{f.changes > 0 ? `+${f.changes} new` : "No changes"}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Last sync: {f.lastSync}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: "feeds", label: "Rule Change Alerts", count: alerts.filter(a => a.status === "Triggered").length },
          { id: "alerts", label: "All Notifications", count: alerts.length },
          { id: "submissions", label: "FINRA Submissions", count: submissions.length },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Rule Change Alerts / All Notifications */}
      {(activeTab === "feeds" || activeTab === "alerts") && (
        <div className="space-y-3">
          {alerts.filter(a => activeTab === "feeds" ? a.status === "Triggered" : true).map(a => (
            <div key={a.id} className={`rounded-lg border p-4 space-y-3 ${a.severity === "High" ? "border-red-200 bg-red-50/20" : a.severity === "Medium" ? "border-yellow-200 bg-yellow-50/20" : "border-border"}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {a.severity === "High" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {a.severity === "Medium" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                  {a.severity === "Low" && <Info className="h-4 w-4 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <StatusBadge status={a.severity} />
                    <StatusBadge status={a.status} />
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{a.rule}</span>
                    <span className="text-[10px] text-muted-foreground">→ {a.affectedWSP}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{a.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Detected: {a.detected}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Edit2 className="h-3 w-3" /> Update WSP</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs"><XCircle className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FINRA Submissions */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-foreground">Submission Tracker</p>
            <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> New Submission</Button>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b">
                  {["Submission Type", "Period", "Status", "Submitted", "Reference #", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map(s => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-4 py-3 font-medium text-foreground text-sm">{s.type}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.period}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.submitted}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{s.ref}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── View 6: Cross-Module Integration (AML / Trade Surveillance) ──────────────

function CrossModuleView({ onBack }: { onBack: () => void }) {
  const [activeModule, setActiveModule] = useState<"aml" | "trade">("aml");

  const amlLinks = [
    { wsp: "AML / CIP / CDD", section: "Section 8.2 — CDD Threshold Procedures", module: "AML Monitor", signal: "Unusual cash activity > $10,000", status: "Active", lastTriggered: "Apr 7, 2026" },
    { wsp: "AML / CIP / CDD", section: "Section 9.1 — SAR Filing Procedures", module: "AML Monitor", signal: "SAR filed for account #8821-A", status: "Active", lastTriggered: "Apr 3, 2026" },
    { wsp: "General Supervision", section: "Section 2.2 — Escalation Path", module: "AML Monitor", signal: "High-risk customer onboarding flag", status: "Active", lastTriggered: "Mar 29, 2026" },
    { wsp: "Recordkeeping", section: "Section 4.1 — Retention Schedule", module: "AML Monitor", signal: "AML record retention verified (5-year)", status: "Active", lastTriggered: "Apr 1, 2026" },
  ];

  const tradeLinks = [
    { wsp: "Retail Brokerage", section: "Section 5.4 — Recommendation Documentation", module: "Trade Surveillance", signal: "Churning pattern detected — Account #4492", status: "Warning", lastTriggered: "Apr 8, 2026" },
    { wsp: "Regulation Best Interest", section: "Section 4.2 — Conflict of Interest Disclosure", module: "Trade Surveillance", signal: "Potential conflict: Rep owns same security", status: "Warning", lastTriggered: "Apr 6, 2026" },
    { wsp: "Heightened Supervision", section: "Section 7.1 — Annual Review", module: "Trade Surveillance", signal: "Heightened supervision rep — unusual volume", status: "Active", lastTriggered: "Apr 5, 2026" },
    { wsp: "Communications Supervision", section: "Section 3.1 — Digital Communications", module: "Trade Surveillance", signal: "Unapproved communication channel detected", status: "Warning", lastTriggered: "Apr 2, 2026" },
  ];

  const links = activeModule === "aml" ? amlLinks : tradeLinks;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Cross-Module Integration</h1>
          <p className="text-muted-foreground mt-1">Live linkages between WSP procedures and AML / Trade Surveillance signals.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Linkage</Button>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { name: "AML Monitor", icon: Shield, status: "Active", links: 4, signals: 2, color: "green" },
          { name: "Trade Surveillance", icon: Activity, status: "Active", links: 4, signals: 2, color: "yellow" },
          { name: "Compliance Analyzer", icon: BarChart2, status: "Active", links: 8, signals: 0, color: "green" },
        ].map(m => (
          <div key={m.name} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <m.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{m.name}</span>
              </div>
              <StatusBadge status={m.status} />
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-foreground">{m.links}</p>
                <p className="text-[10px] text-muted-foreground">WSP Links</p>
              </div>
              <div>
                <p className={`text-xl font-bold ${m.signals > 0 ? "text-yellow-600" : "text-green-600"}`}>{m.signals}</p>
                <p className="text-[10px] text-muted-foreground">Active Signals</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full h-7 text-xs gap-1">
              <Eye className="h-3 w-3" /> View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Module Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: "aml", label: "AML / CIP / CDD Integration" },
          { id: "trade", label: "Trade Surveillance Integration" },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveModule(tab.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeModule === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Linkage Table */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Showing {links.length} active WSP-to-module linkages. Signals from {activeModule === "aml" ? "AML Monitor" : "Trade Surveillance"} are automatically mapped to the relevant WSP section for immediate remediation.</p>
        {links.map((l, i) => (
          <div key={i} className={`rounded-lg border p-4 space-y-2 ${l.status === "Warning" ? "border-yellow-200 bg-yellow-50/20" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusBadge status={l.status} />
                  <span className="text-[10px] text-muted-foreground">→ {l.wsp}</span>
                  <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{l.section}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{l.signal}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Last triggered: {l.lastTriggered}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><FileText className="h-3 w-3" /> Open WSP</Button>
                {l.status === "Warning" && (
                  <Button size="sm" className="h-7 text-xs gap-1 bg-yellow-500 text-white hover:bg-yellow-600"><AlertTriangle className="h-3 w-3" /> Review</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── View 7: Branch-Specific WSP Customization ────────────────────────────────

function BranchWSPView({ onBack }: { onBack: () => void }) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const branches = [
    { id: "nyc", name: "New York — HQ", code: "NY-001", supervisors: 3, customSections: 5, status: "Current", lastReview: "Apr 1, 2026" },
    { id: "la", name: "Los Angeles", code: "CA-002", supervisors: 2, customSections: 3, status: "Needs Review", lastReview: "Feb 10, 2026" },
    { id: "chi", name: "Chicago", code: "IL-003", supervisors: 1, customSections: 2, status: "Current", lastReview: "Mar 20, 2026" },
    { id: "mia", name: "Miami", code: "FL-004", supervisors: 2, customSections: 4, status: "Overdue", lastReview: "Dec 15, 2025" },
    { id: "bos", name: "Boston", code: "MA-005", supervisors: 1, customSections: 1, status: "Current", lastReview: "Mar 28, 2026" },
  ];

  const customizations = [
    { section: "Section 2.1 — Designated Supervisors", type: "Override", description: "Branch-specific supervisor: James Whitfield (NY Branch Manager)", inherited: false },
    { section: "Section 3.1 — Daily Review Requirements", type: "Addendum", description: "Additional NY-specific review for high-volume equity trading desk", inherited: false },
    { section: "Section 4.2 — WORM Compliance", type: "Inherited", description: "Inherits firm-wide WORM storage policy — no branch override", inherited: true },
    { section: "Section 7.1 — Heightened Supervision", type: "Override", description: "3 registered reps under heightened supervision at NY branch", inherited: false },
    { section: "Section 9.1 — Remote Supervision", type: "Addendum", description: "NY branch hybrid work policy: 3 days in-office minimum", inherited: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Branch-Specific WSP Customization</h1>
          <p className="text-muted-foreground mt-1">Manage firm-wide WSP inheritance and branch-level overrides or addenda.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export All</Button>
        <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90"><Plus className="h-4 w-4" /> Add Branch</Button>
      </div>

      {/* Architecture Diagram */}
      <div className="rounded-lg border bg-muted/10 p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">WSP Inheritance Architecture</p>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg border-2 border-foreground bg-card px-6 py-3 text-center">
            <p className="text-xs font-bold text-foreground">Firm-Wide Master WSP</p>
            <p className="text-[10px] text-muted-foreground">FINRA Rule 3110 · All 8 Sub-Manuals · v3.2</p>
          </div>
          <div className="flex gap-2 items-center text-muted-foreground">
            <div className="h-px w-16 bg-border" />
            <span className="text-[10px]">Inherited by all branches</span>
            <div className="h-px w-16 bg-border" />
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {branches.map(b => (
              <button key={b.id} onClick={() => setSelectedBranch(selectedBranch === b.id ? null : b.id)}
                className={`rounded-lg border px-4 py-2.5 text-center transition-all ${selectedBranch === b.id ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/30"}`}>
                <p className={`text-xs font-semibold ${selectedBranch === b.id ? "text-background" : "text-foreground"}`}>{b.name}</p>
                <p className={`text-[10px] ${selectedBranch === b.id ? "text-background/70" : "text-muted-foreground"}`}>{b.code} · {b.customSections} custom</p>
                <div className="mt-1">
                  <StatusBadge status={b.status} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Detail */}
      {selectedBranch ? (
        <div className="space-y-4">
          {(() => {
            const branch = branches.find(b => b.id === selectedBranch)!;
            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{branch.name} — Custom Sections</h3>
                    <p className="text-xs text-muted-foreground">{branch.code} · {branch.supervisors} supervisors · Last review: {branch.lastReview}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> Add Override</Button>
                    <Button variant="outline" size="sm" className="gap-1 h-8 text-xs"><Edit2 className="h-3.5 w-3.5" /> Edit Branch WSP</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {customizations.map((c, i) => (
                    <div key={i} className={`rounded-lg border p-3 flex items-start gap-3 ${c.inherited ? "opacity-60" : ""}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${c.type === "Override" ? "bg-orange-100" : c.type === "Addendum" ? "bg-blue-100" : "bg-muted"}`}>
                        {c.type === "Override" && <Edit2 className="h-3 w-3 text-orange-600" />}
                        {c.type === "Addendum" && <Plus className="h-3 w-3 text-blue-600" />}
                        {c.type === "Inherited" && <Layers className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${c.type === "Override" ? "bg-orange-100 text-orange-700 border-orange-200" : c.type === "Addendum" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-muted text-muted-foreground border-border"}`}>{c.type}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{c.section}</span>
                        </div>
                        <p className="text-xs text-foreground">{c.description}</p>
                      </div>
                      {!c.inherited && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 shrink-0"><Edit2 className="h-3 w-3" /></Button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Select a branch above to view its custom WSP sections and overrides.</p>
        </div>
      )}
    </div>
  );
}

// ─── View 8: Annual Certification Wizard (FINRA Rule 3130) ────────────────────

function CertWizardView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 1, title: "Certification Period", description: "Define the annual certification scope and period" },
    { id: 2, title: "WSP Review Confirmation", description: "Confirm all sub-manuals have been reviewed" },
    { id: 3, title: "Testing & Verification", description: "Document supervisory system testing results" },
    { id: 4, title: "CEO Attestation", description: "Obtain CEO/President certification statement" },
    { id: 5, title: "FINRA Submission", description: "Submit certification via FINRA Submission API" },
  ];

  const wspReviewStatus = [
    { name: "General Supervision", reviewed: true, reviewer: "Sarah Chen", date: "Apr 1, 2026" },
    { name: "Retail Brokerage", reviewed: true, reviewer: "James Whitfield", date: "Mar 28, 2026" },
    { name: "AML / CIP / CDD", reviewed: true, reviewer: "Sarah Chen", date: "Apr 2, 2026" },
    { name: "Communications Supervision", reviewed: false, reviewer: "—", date: "—" },
    { name: "Recordkeeping", reviewed: true, reviewer: "Sarah Chen", date: "Mar 15, 2026" },
    { name: "Heightened Supervision", reviewed: false, reviewer: "—", date: "—" },
    { name: "Regulation Best Interest", reviewed: true, reviewer: "Sarah Chen", date: "Apr 3, 2026" },
    { name: "Digital Assets", reviewed: false, reviewer: "—", date: "—" },
  ];

  const reviewedCount = wspReviewStatus.filter(w => w.reviewed).length;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Annual Certification Wizard</h1>
          <p className="text-muted-foreground mt-1">FINRA Rule 3130 — CEO/President Annual Certification of Compliance Policies</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Save Progress</Button>
      </div>

      {/* Progress Steps */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button onClick={() => setStep(s.id)} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > s.id ? "bg-green-500 text-white" : step === s.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <p className={`text-[10px] text-center leading-tight max-w-[80px] ${step === s.id ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s.title}</p>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 mx-1 mb-5 ${step > s.id ? "bg-green-500" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-lg border p-6 space-y-4 min-h-64">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Certification Period</h3>
            <p className="text-sm text-muted-foreground">Define the scope and period for the FINRA Rule 3130 annual certification.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Certification Year", value: "Fiscal Year 2025 (Jan 1 – Dec 31, 2025)" },
                { label: "Firm CRD Number", value: "123456" },
                { label: "CEO / President", value: "Wen Ge" },
                { label: "CCO", value: "Sarah Chen" },
                { label: "Submission Deadline", value: "April 30, 2026" },
                { label: "FINRA Member ID", value: "FINRA-BD-78901" },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</p>
                  <div className="rounded border bg-muted/30 px-3 py-2 text-sm text-foreground">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Step 2: WSP Review Confirmation</h3>
              <span className={`text-sm font-semibold ${reviewedCount === wspReviewStatus.length ? "text-green-600" : "text-yellow-600"}`}>
                {reviewedCount}/{wspReviewStatus.length} reviewed
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Confirm that all WSP sub-manuals have been reviewed and updated during the certification period.</p>
            <div className="space-y-2">
              {wspReviewStatus.map(w => (
                <div key={w.name} className={`rounded-lg border p-3 flex items-center gap-3 ${!w.reviewed ? "border-yellow-200 bg-yellow-50/20" : ""}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${w.reviewed ? "bg-green-500" : "bg-yellow-200"}`}>
                    {w.reviewed ? <CheckCircle2 className="h-3 w-3 text-white" /> : <Clock className="h-3 w-3 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground">{w.reviewed ? `Reviewed by ${w.reviewer} on ${w.date}` : "Pending review"}</p>
                  </div>
                  {!w.reviewed && (
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Edit2 className="h-3 w-3" /> Review Now</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Testing & Verification</h3>
            <p className="text-sm text-muted-foreground">Document the results of supervisory system testing conducted during the certification period.</p>
            <div className="space-y-3">
              {[
                { test: "Trade Surveillance System Testing", result: "Passed", date: "Mar 15, 2026", notes: "All alerts firing correctly; no false negatives detected in sample review." },
                { test: "AML Transaction Monitoring Review", result: "Passed", date: "Feb 28, 2026", notes: "SAR filing procedures tested with 10 simulated scenarios. 100% detection rate." },
                { test: "Communications Supervision Spot Check", result: "Needs Attention", date: "Jan 20, 2026", notes: "2 unapproved communication channels identified. Remediation in progress." },
                { test: "Annual Branch Inspection", result: "Passed", date: "Mar 5, 2026", notes: "All 5 branches inspected. No material deficiencies identified." },
              ].map(t => (
                <div key={t.test} className={`rounded-lg border p-3 space-y-1.5 ${t.result === "Needs Attention" ? "border-yellow-200 bg-yellow-50/20" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{t.test}</p>
                    <StatusBadge status={t.result === "Passed" ? "Completed" : "Warning"} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Conducted: {t.date}</p>
                  <p className="text-xs text-muted-foreground">{t.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 4: CEO Attestation</h3>
            <p className="text-sm text-muted-foreground">The CEO/President must certify the following statement as required by FINRA Rule 3130(b).</p>
            <div className="rounded-lg border border-foreground/20 bg-muted/20 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-foreground" />
                <p className="text-sm font-semibold text-foreground">FINRA Rule 3130 Certification Statement</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">
                "I, the undersigned, as Chief Executive Officer / President of [Firm Name], hereby certify that I have reviewed the firm's Written Supervisory Procedures, that the firm has in place processes to establish, maintain, review, test, and modify written compliance policies and supervisory procedures reasonably designed to achieve compliance with applicable FINRA rules, MSRB rules, and federal securities laws and regulations, and that I have met with the firm's Chief Compliance Officer within the past year to discuss such processes."
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">CEO / President Name</p>
                  <div className="rounded border bg-background px-3 py-2 text-sm text-foreground">Wen Ge</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date of Certification</p>
                  <div className="rounded border bg-background px-3 py-2 text-sm text-foreground">April 9, 2026</div>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Digital Signature</p>
                  <div className="rounded border border-dashed bg-background px-3 py-4 text-center text-sm text-muted-foreground cursor-pointer hover:border-foreground/30 transition-colors">
                    Click to apply digital signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 5: FINRA Submission</h3>
            <p className="text-sm text-muted-foreground">Submit the completed certification to FINRA via the Submission API.</p>
            <div className="rounded-lg border bg-green-50/30 border-green-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm font-semibold text-green-700">Certification Ready for Submission</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Certification Period", value: "FY 2025" },
                  { label: "WSPs Reviewed", value: `${reviewedCount}/${wspReviewStatus.length}` },
                  { label: "Tests Completed", value: "4 / 4" },
                  { label: "CEO Attestation", value: "Pending Signature" },
                  { label: "Submission Deadline", value: "April 30, 2026" },
                  { label: "API Endpoint", value: "FINRA Submission API v1" },
                ].map(f => (
                  <div key={f.label} className="flex justify-between">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium text-foreground">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button size="sm" className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90 h-10">
              <Send className="h-4 w-4" /> Submit to FINRA via Submission API
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">Submission will be transmitted to api.finra.org/submission/v1 and a confirmation reference number will be returned.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-xs text-muted-foreground self-center">Step {step} of {totalSteps}</span>
        <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90" onClick={() => setStep(Math.min(totalSteps, step + 1))} disabled={step === totalSteps}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── View 9: White-Label Branding ─────────────────────────────────────────────

function WhiteLabelView({ onBack }: { onBack: () => void }) {
  const [selectedFirm, setSelectedFirm] = useState("acme");
  const [previewMode, setPreviewMode] = useState(false);

  const firms = [
    { id: "acme", name: "Acme Securities LLC", crd: "123456", logo: "AS", primaryColor: "#1a1a2e", accentColor: "#e94560", plan: "Enterprise" },
    { id: "bluerock", name: "BlueRock Capital", crd: "234567", logo: "BR", primaryColor: "#0f3460", accentColor: "#16213e", plan: "Professional" },
    { id: "summit", name: "Summit Advisors Inc.", crd: "345678", logo: "SA", primaryColor: "#2d6a4f", accentColor: "#40916c", plan: "Enterprise" },
  ];

  const firm = firms.find(f => f.id === selectedFirm)!;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">White-Label Branding</h1>
          <p className="text-muted-foreground mt-1">Configure firm-specific branding, logos, and color themes for each client.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setPreviewMode(!previewMode)}>
          <Eye className="h-4 w-4" /> {previewMode ? "Exit Preview" : "Preview"}
        </Button>
        <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90"><Plus className="h-4 w-4" /> Add Firm</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Firm List */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Firms</p>
          {firms.map(f => (
            <button key={f.id} onClick={() => setSelectedFirm(f.id)}
              className={`w-full rounded-lg border p-3 text-left transition-all ${selectedFirm === f.id ? "border-foreground bg-muted/20" : "hover:border-foreground/20"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: f.primaryColor }}>
                  {f.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">CRD #{f.crd} · {f.plan}</p>
                </div>
              </div>
            </button>
          ))}
          <Button variant="outline" size="sm" className="w-full gap-1 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> Add New Firm</Button>
        </div>

        {/* Branding Config */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{firm.name} — Branding Configuration</h3>
              <StatusBadge status={firm.plan} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Firm Name (Display)</p>
                <div className="rounded border bg-muted/30 px-3 py-2 text-sm text-foreground">{firm.name}</div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">CRD Number</p>
                <div className="rounded border bg-muted/30 px-3 py-2 text-sm text-foreground">{firm.crd}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Logo Upload</p>
              <div className="rounded border border-dashed p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: firm.primaryColor }}>
                  {firm.logo}
                </div>
                <div>
                  <p className="text-xs text-foreground font-medium">Current logo placeholder</p>
                  <p className="text-[10px] text-muted-foreground">Upload SVG, PNG, or JPG (max 2MB)</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto gap-1 h-8 text-xs"><Upload className="h-3.5 w-3.5" /> Upload</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Primary Color</p>
                <div className="flex items-center gap-2 rounded border px-3 py-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: firm.primaryColor }} />
                  <span className="text-sm font-mono text-foreground">{firm.primaryColor}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Accent Color</p>
                <div className="flex items-center gap-2 rounded border px-3 py-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: firm.accentColor }} />
                  <span className="text-sm font-mono text-foreground">{firm.accentColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Module Visibility</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "WSP Library", enabled: true },
                  { name: "Gap Analysis", enabled: true },
                  { name: "Attestation Center", enabled: true },
                  { name: "Rule Monitor", enabled: true },
                  { name: "Branch WSPs", enabled: true },
                  { name: "Rule 3130 Wizard", enabled: false },
                  { name: "Cross-Module (AML)", enabled: true },
                  { name: "Registration Module", enabled: false },
                ].map(m => (
                  <div key={m.name} className="flex items-center justify-between rounded border px-3 py-2">
                    <span className="text-xs text-foreground">{m.name}</span>
                    <div className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${m.enabled ? "bg-green-500" : "bg-muted"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${m.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90"><Save className="h-4 w-4" /> Save Configuration</Button>
              <Button variant="outline" size="sm" className="gap-2"><Globe className="h-4 w-4" /> Publish to Firm</Button>
            </div>
          </div>

          {/* Preview */}
          {previewMode && (
            <div className="rounded-lg border overflow-hidden">
              <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b">
                Live Preview — {firm.name}
              </div>
              <div className="flex h-40" style={{ backgroundColor: firm.primaryColor }}>
                <div className="w-40 border-r border-white/10 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: firm.accentColor }}>
                      {firm.logo}
                    </div>
                    <span className="text-white text-[11px] font-semibold truncate">{firm.name.split(" ")[0]}</span>
                  </div>
                  {["WSP Library", "Gap Analysis", "Rule Monitor", "Attestations"].map(item => (
                    <div key={item} className="text-white/60 text-[10px] px-2 py-1 rounded hover:bg-white/10 cursor-pointer">{item}</div>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <p className="text-white text-sm font-semibold">WSP Management</p>
                  <p className="text-white/60 text-[10px] mt-0.5">FINRA Rule 3110 Compliance</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["81 / 92 Current", "1 Overdue", "5 Pending"].map(s => (
                      <div key={s} className="rounded bg-white/10 px-2 py-1.5 text-[10px] text-white">{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main WSP Management Page ─────────────────────────────────────────────────

export default function WSPManagement() {
  const [view, setView] = useState<View>("library");
  const [editorManualId, setEditorManualId] = useState<string>("gs");

  const openEditor = (id: string) => {
    setEditorManualId(id);
    setView("editor");
  };

  if (view === "editor") return <WSPEditorView manualId={editorManualId} onBack={() => setView("library")} />;
  if (view === "attestation") return <AttestationCenterView onBack={() => setView("library")} />;
  if (view === "gap-analysis") return <GapAnalysisView onBack={() => setView("library")} />;
  if (view === "rule-monitor") return <RuleMonitorView onBack={() => setView("library")} />;
  if (view === "cross-module") return <CrossModuleView onBack={() => setView("library")} />;
  if (view === "branch-wsp") return <BranchWSPView onBack={() => setView("library")} />;
  if (view === "cert-wizard") return <CertWizardView onBack={() => setView("library")} />;
  if (view === "white-label") return <WhiteLabelView onBack={() => setView("library")} />;

  return (
    <WSPLibraryView
      onOpenEditor={openEditor}
      onOpenAttestation={() => setView("attestation")}
      onOpenGapAnalysis={() => setView("gap-analysis")}
      onOpenRuleMonitor={() => setView("rule-monitor")}
      onOpenCrossModule={() => setView("cross-module")}
      onOpenBranchWSP={() => setView("branch-wsp")}
      onOpenCertWizard={() => setView("cert-wizard")}
      onOpenWhiteLabel={() => setView("white-label")}
    />
  );
}
