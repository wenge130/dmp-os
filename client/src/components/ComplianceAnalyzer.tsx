import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, 
  FileText, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  MessageSquare,
  Scale,
  Users,
  BrainCircuit,
  Zap,
  ShieldCheck,
  History as HistoryIcon,
  Sparkles,
  ArrowRight,
  Eye,
  Edit3,
  Check,
  X,
  Plus,
  ArrowDownCircle,
  Activity,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import WorkflowCascade from "./WorkflowCascade";

type ViewState = "home" | "analysis" | "workflow";

export default function ComplianceAnalyzer() {
  const [view, setView] = useState<ViewState>("home");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recentAnalyses = [
    {
      id: 1,
      name: "LLC Employee Trading Policy.pdf",
      time: "2 hours ago",
      status: "critical",
      issues: 3
    },
    {
      id: 2,
      name: "Customer Due Diligence Rule.pdf",
      time: "1 day ago",
      status: "clear",
      issues: 0
    },
    {
      id: 3,
      name: "Asset Management Compliance Manual.pdf",
      time: "3 days ago",
      status: "warning",
      issues: 12
    }
  ];

  if (view === "analysis") {
    return <AnalysisView onBack={() => setView("home")} onShowWorkflow={() => setView("workflow")} />;
  }

  if (view === "workflow") {
    return <WorkflowView onBack={() => setView("analysis")} />;
  }

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      {/* Header */}
      <div className="h-16 border-b border-border bg-white flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-background" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Compliance Analyzer</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              className="h-9 w-64 rounded-md border border-input bg-muted/50 px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Search documents..."
            />
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">AI-Native Compliance Review</h2>
          <p className="text-muted-foreground text-base">
            Upload your regulatory manuals and policies. DMP AI will analyze for FINRA/SEC gaps, suggest corrections, and visualize the operational impact of every change.
          </p>
        </div>

        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-border rounded-xl bg-muted/30 p-16 flex flex-col items-center justify-center text-center space-y-6 hover:bg-muted/50 transition-all cursor-pointer group relative overflow-hidden"
          onClick={() => {
            setIsAnalyzing(true);
            setTimeout(() => {
              setIsAnalyzing(false);
              setView("analysis");
            }, 2000);
          }}
        >
          {isAnalyzing ? (
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
              <div className="space-y-2">
                <p className="font-bold text-lg">Analyzing Document...</p>
                <p className="text-sm text-muted-foreground">Running FINRA Rule 3110 & 4512 cross-checks</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Drop PDF to start analysis</h3>
                <p className="text-sm text-muted-foreground">Supports Manuals, WSPs, and Internal Policies</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="bg-white">SEC 17a-4</Badge>
                <Badge variant="outline" className="bg-white">FINRA 3110</Badge>
                <Badge variant="outline" className="bg-white">Reg BI</Badge>
              </div>
            </>
          )}
        </div>

        {/* Recent Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Analyses</h3>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAnalyses.map((doc) => (
              <Card key={doc.id} className="hover:border-foreground/20 transition-colors cursor-pointer group">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {doc.status === "critical" && (
                      <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 text-[10px] uppercase">Critical Gap</Badge>
                    )}
                    {doc.status === "warning" && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] uppercase">Review Needed</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold truncate">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground">{doc.time}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-[10px] font-medium">{doc.issues} issues identified</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisView({ onBack, onShowWorkflow }: { onBack: () => void, onShowWorkflow: () => void }) {
  const [selectedPara, setSelectedPara] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const paragraphs = [
    {
      id: 1,
      text: "Subject: Summary of Complaint and Initial Defense Assessment",
      type: "header"
    },
    {
      id: 2,
      text: "Keeping our customers' interest foremost is a key to the Firm's success. The trust of our customers and the Firm's reputation are of paramount importance. Effective supervision is an integral part of achieving our goals in serving our customers.",
      type: "text",
      hasIssue: true,
      issue: "Lacks specific supervisory procedures required by FINRA Rule 3110.",
      suggestion: "Keeping our customers' interest foremost is a key to the Firm's success. The Firm's Chief Compliance Officer (CCO) shall conduct monthly reviews of all customer complaints and document the findings in the Supervisory Log (Form 102). Effective supervision, including quarterly audits of representative communications, is an integral part of achieving our goals."
    },
    {
      id: 3,
      text: "The Firm's regulatory posture as an Electronic Money Institution/payment services provider requires strict adherence to KYC and AML standards. We must maintain an updated record of all customer transactions for a period of seven years.",
      type: "text"
    }
  ];

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      onShowWorkflow();
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#FBFBFB] animate-in slide-in-from-right duration-500">
      {/* Analysis Header */}
      <div className="h-14 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold truncate max-w-[400px]">Asset Management Compliance Manual.pdf</span>
            <Badge variant="outline" className="text-[10px] bg-muted/50">Version 1.2</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <HistoryIcon className="h-3.5 w-3.5" />
            History
          </Button>
          <Button size="sm" className="h-8 text-xs gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Repair All
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Document Content */}
        <div className="flex-1 overflow-auto bg-white p-12 border-r border-border">
          <div className="max-w-3xl mx-auto space-y-8">
            {paragraphs.map((p) => (
              <div 
                key={p.id}
                className={cn(
                  "relative p-4 rounded-lg transition-all duration-200 cursor-pointer",
                  p.type === "header" ? "text-xl font-bold border-b border-border pb-4" : "text-sm leading-relaxed text-slate-700",
                  p.hasIssue && "bg-orange-50/50 border border-orange-100",
                  selectedPara === p.id && "ring-2 ring-primary ring-offset-2 bg-muted/30"
                )}
                onClick={() => setSelectedPara(p.id)}
              >
                {p.hasIssue && (
                  <div className="absolute -left-2 top-4 w-1 h-12 bg-orange-500 rounded-full" aria-hidden="true" />
                )}
                {p.text}
                {p.hasIssue && (
                  <div className="absolute top-4 right-4">
                    <AlertCircle className="h-4 w-4 text-orange-500" aria-label="Issue detected" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="w-[400px] shrink-0 bg-[#FBFBFB] flex flex-col">
          <div className="p-4 border-b border-border bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <BrainCircuit className="h-4 w-4" />
              AI Insight Panel
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            {selectedPara && paragraphs.find(p => p.id === selectedPara)?.hasIssue ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-2">
                  <Badge className="bg-orange-500 text-white border-none text-[10px] uppercase">Critical Gap</Badge>
                  <h3 className="text-sm font-bold">Inadequate Supervisory Procedures</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This paragraph lacks the specific, measurable criteria required by **FINRA Rule 3110**. It states intent but does not define *how* supervision is conducted or *who* is responsible.
                  </p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Suggested Correction</span>
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs italic leading-relaxed text-slate-700">
                    "{paragraphs.find(p => p.id === selectedPara)?.suggestion}"
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 h-8 text-[10px] bg-primary hover:bg-primary/90"
                      onClick={handleApply}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <Activity className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <Check className="h-3 w-3 mr-2" />
                      )}
                      {isApplying ? "Applying..." : "Apply & Update OS"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-[10px]">
                      <Edit3 className="h-3 w-3 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Impact on DMP OS</p>
                  <div className="space-y-2">
                    <ImpactItem label="Digital Ledger" status="Update Required" icon={Fingerprint} />
                    <ImpactItem label="HR Standing" status="Verification Needed" icon={Users} />
                    <ImpactItem label="FINOP Logs" status="Log Entry Required" icon={Activity} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 opacity-50">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Eye className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Select a paragraph</p>
                  <p className="text-xs text-muted-foreground">Select any highlighted text to view AI analysis and suggestions</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function ImpactItem({ label, status, icon: Icon }: { label: string, status: string, icon: any }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-white border border-border shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-medium">{label}</span>
      </div>
      <span className="text-[9px] text-amber-600 font-bold uppercase">{status}</span>
    </div>
  );
}

function WorkflowView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < 4 ? s + 1 : s));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col bg-background animate-in zoom-in-95 duration-500">
      <div className="h-14 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Workflow className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold">Operational Cascade: Document Modification</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-muted/10">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Updating System State</h3>
            <p className="text-muted-foreground">Propagating manual changes across all DMP OS departments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <CascadeStep 
              label="Books & Records" 
              desc="Updating Archive" 
              active={step >= 1} 
              done={step > 1} 
              icon={Archive}
            />
            <CascadeStep 
              label="Compliance" 
              desc="Manual Sync" 
              active={step >= 2} 
              done={step > 2} 
              icon={ShieldCheck}
            />
            <CascadeStep 
              label="HR Standing" 
              desc="U4 CE Check" 
              active={step >= 3} 
              done={step > 3} 
              icon={Users}
            />
            <CascadeStep 
              label="Digital Ledger" 
              desc="Cryptographic Hash" 
              active={step >= 4} 
              done={step >= 4} 
              icon={Fingerprint}
            />
          </div>

          {step >= 4 && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-green-800">System Synchronized</p>
                  <p className="text-xs text-green-600">Document changes successfully propagated to all 12 operational modules.</p>
                </div>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onBack}>
                Return to Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CascadeStep({ label, desc, active, done, icon: Icon }: { label: string, desc: string, active: boolean, done: boolean, icon: any }) {
  return (
    <div className={cn(
      "p-6 rounded-xl border transition-all duration-500 flex flex-col items-center text-center space-y-4",
      active ? "bg-white border-primary shadow-lg shadow-primary/5" : "bg-muted/30 border-border opacity-50",
      done && "border-green-500 bg-green-50/30"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500",
        active ? "bg-primary text-white" : "bg-muted text-muted-foreground",
        done && "bg-green-500"
      )}>
        {done ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      {active && !done && (
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
}
