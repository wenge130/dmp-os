import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, ChevronRight, CheckCircle, AlertCircle, Edit2, Download, ExternalLink, ArrowRight, BarChart } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";

export default function RegulatoryReporting() {
  const [query, setQuery] = useState("");
  
  return (
    <div className="h-screen flex bg-background">
      {/* Left Pane: Chat / NLP Interface */}
      <div className="flex-1 flex flex-col border-r border-border bg-background">
        
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center px-6 shrink-0">
          <h1 className="text-sm font-medium text-foreground">Regulatory Reporting Assistant</h1>
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
                  I can assist with your Regulatory Reporting requirements. I can draft responses to FINRA inquiries, compile 4530 filings, or summarize recent examination findings.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge text="Draft FINRA 4530 Filing" />
                  <Badge text="Review Form U4 updates" />
                  <Badge text="Analyze Branch Exam Reports" />
                </div>
              </div>
            </div>

            {/* User Message Mock */}
            <div className="flex gap-4 justify-end">
              <div className="bg-secondary/50 rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-sm text-foreground">Draft a response to the recent FINRA inquiry regarding the delayed OATS reporting in Q2.</p>
              </div>
            </div>

            {/* AI Response Mock */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-background">D</span>
              </div>
              <div className="space-y-4 pt-1 w-full">
                <p className="text-sm text-foreground leading-relaxed">
                  I have drafted a response to the FINRA inquiry (Matter No. 202308192). The draft outlines the root cause of the delay (a vendor system outage) and details the remediation steps taken by the firm.
                </p>
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">FINRA Inquiry Response Draft</h4>
                  <p className="text-sm text-muted-foreground mt-2"><strong>Root Cause Analysis:</strong> On May 14th, the firm's third-party order routing vendor experienced a 45-minute connectivity outage, resulting in the late submission of 1,204 OATS reports.</p>
                  <p className="text-sm text-muted-foreground"><strong>Remediation:</strong> The firm has since implemented a secondary, redundant routing connection and updated WSP Section 6 to require daily reconciliation of OATS submissions against internal trade logs.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Edit2 className="w-3 h-3 mr-2" /> Edit Draft
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="w-3 h-3 mr-2" /> Export to Word
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
              placeholder="Ask anything or search reports..." 
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
          <h2 className="text-sm font-medium text-foreground">Reporting Context</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            
            {/* Active Document */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reference Document</h3>
              <div className="p-3 border border-border rounded-lg bg-background hover:border-foreground/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-foreground">FINRA Inquiry Ltr (May 2023)</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  "Please explain the circumstances surrounding the late reporting of 1,204 Route Reports on May 14..."
                </p>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workflow Actions</h3>
              <div className="space-y-1">
                <ActionItem icon={CheckCircle} label="Send to Legal for Review" color="text-green-500" />
                <ActionItem icon={BarChart} label="Attach OATS Data Extract" color="text-blue-500" />
              </div>
            </div>

            {/* Table of Contents Quick Links */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reporting Categories</h3>
              <div className="space-y-1 text-sm text-foreground">
                <TocItem num="1" label="FINRA Rule 4530 Filings" />
                <TocItem num="2" label="Regulatory Inquiries" active />
                <TocItem num="3" label="Branch Exam Reports" />
                <TocItem num="4" label="Form U4/U5 Updates" />
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
