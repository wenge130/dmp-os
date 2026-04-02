import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, ChevronRight, CheckCircle, AlertCircle, Edit2, Download, ExternalLink, ArrowRight } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";

export default function WSPManagement() {
  const [query, setQuery] = useState("");
  
  return (
    <div className="h-screen flex bg-background">
      {/* Left Pane: Chat / NLP Interface */}
      <div className="flex-1 flex flex-col border-r border-border bg-background">
        
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center px-6 shrink-0">
          <h1 className="text-sm font-medium text-foreground">WSP Assistant</h1>
        </div>

        {/* Chat History Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 max-w-2xl mx-auto">
            {/* AI Welcome Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-background">D</span>
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-sm text-foreground leading-relaxed">
                  I am ready to assist with your Written Supervisory Procedures (WSP). I can help you draft new policies, review existing ones against recent FINRA updates, or analyze gaps.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge text="Draft new AML policy" />
                  <Badge text="Review recent FINRA notices" />
                  <Badge text="Check Customer Complaints WSP" />
                </div>
              </div>
            </div>

            {/* User Message Mock */}
            <div className="flex gap-4 justify-end">
              <div className="bg-secondary/50 rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-sm text-foreground">Draft a new section for the WSP covering the supervision of digital assets trading.</p>
              </div>
            </div>

            {/* AI Response Mock */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-background">D</span>
              </div>
              <div className="space-y-4 pt-1 w-full">
                <p className="text-sm text-foreground leading-relaxed">
                  I have drafted a preliminary section for Digital Assets Trading Supervision. This draft incorporates recent SEC guidance on digital asset securities and FINRA's expectations for member firms.
                </p>
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Section 12: Digital Assets</h4>
                  <p className="text-sm text-muted-foreground mt-2"><strong>12.1 Due Diligence:</strong> Prior to engaging in any digital asset activities, the firm must conduct and document comprehensive due diligence on the asset and the trading platform.</p>
                  <p className="text-sm text-muted-foreground"><strong>12.2 Risk Disclosures:</strong> Registered representatives must provide approved risk disclosure documents to clients prior to any transaction.</p>
                  <p className="text-sm text-muted-foreground"><strong>12.3 Trade Monitoring:</strong> All digital asset transactions will be monitored using the firm's primary surveillance system for anomalous activity.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Edit2 className="w-3 h-3 mr-2" /> Refine Draft
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-600" /> Submit for Approval
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-background pb-6">
          <div className="max-w-2xl mx-auto">
            <ChatInput 
              query={query} 
              setQuery={setQuery} 
              placeholder="Ask anything or search WSPs..." 
            />
            <p className="text-center text-xs text-muted-foreground mt-3">
              DMP AI can make mistakes. Verify critical regulatory information.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane: Reference / Context Area */}
      <div className="w-[400px] bg-card flex flex-col hidden lg:flex">
        <div className="h-14 border-b border-border flex items-center px-4 justify-between shrink-0">
          <h2 className="text-sm font-medium text-foreground">WSP Context</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            
            {/* Active Document */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Current Draft</h3>
              <div className="p-3 border border-border rounded-lg bg-background hover:border-foreground/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-foreground">Digital Assets WSP Draft</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  Version 1.0 - Generated by DMP AI Assistant based on SEC/FINRA guidelines...
                </p>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Review Actions</h3>
              <div className="space-y-1">
                <ActionItem icon={AlertCircle} label="Run Regulatory Conflict Check" color="text-yellow-500" />
                <ActionItem icon={CheckCircle} label="Send to CCO for Review" color="text-green-500" />
                <ActionItem icon={Download} label="Export as PDF" color="text-foreground" />
              </div>
            </div>

            {/* Table of Contents Quick Links */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">WSP Sub-Manuals</h3>
              <div className="space-y-1 text-sm text-foreground">
                <TocItem num="1" label="Retail Brokerage" />
                <TocItem num="2" label="Institutional Business" />
                <TocItem num="3" label="Investment Banking" />
                <TocItem num="12" label="Digital Assets" active />
              </div>
            </div>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer transition-colors">
      {text}
    </div>
  );
}

function ActionItem({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-md cursor-pointer transition-colors group">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function TocItem({ num, label, active = false }: { num: string, label: string, active?: boolean }) {
  return (
    <div className={`px-2 py-1.5 rounded text-sm cursor-pointer transition-colors flex gap-2 ${active ? 'bg-secondary font-medium text-foreground' : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'}`}>
      <span className="opacity-50">{num}.</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
