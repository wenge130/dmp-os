import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, ChevronRight, CheckCircle, AlertCircle, Edit2, Download, ExternalLink, ArrowRight, GitBranch } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";

export default function SupervisoryWorkflows() {
  const [query, setQuery] = useState("");
  
  return (
    <div className="h-screen flex bg-background">
      {/* Left Pane: Chat / NLP Interface */}
      <div className="flex-1 flex flex-col border-r border-border bg-background">
        
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center px-6 shrink-0">
          <h1 className="text-sm font-medium text-foreground">Trading & Execution Assistant</h1>
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
                  I can help you monitor and analyze Trading & Execution workflows. Ask me to review trade surveillance alerts, check best execution reports, or analyze OATS data.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge text="Review Best Execution" />
                  <Badge text="Analyze Trade Alerts" />
                  <Badge text="Check Market Making rules" />
                </div>
              </div>
            </div>

            {/* User Message Mock */}
            <div className="flex gap-4 justify-end">
              <div className="bg-secondary/50 rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-sm text-foreground">Analyze the recent alerts for potential front-running in the equity desk.</p>
              </div>
            </div>

            {/* AI Response Mock */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-background">D</span>
              </div>
              <div className="space-y-4 pt-1 w-full">
                <p className="text-sm text-foreground leading-relaxed">
                  I have analyzed the surveillance alerts for the equity desk over the past 30 days. There are 3 escalated alerts requiring review regarding potential front-running of block trades.
                </p>
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Alert #TRD-882: Symbol AAPL</p>
                      <p className="text-xs text-muted-foreground mt-1">Proprietary trade executed 2 minutes prior to a client block order of 50,000 shares.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Alert #TRD-891: Symbol MSFT</p>
                      <p className="text-xs text-muted-foreground mt-1">Pattern of small proprietary executions preceding large institutional flow over 3 days.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <GitBranch className="w-3 h-3 mr-2" /> Open Investigation Workflow
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
              placeholder="Ask anything or search trading workflows..." 
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
          <h2 className="text-sm font-medium text-foreground">Workflow Context</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            
            {/* Active Document */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Policy</h3>
              <div className="p-3 border border-border rounded-lg bg-background hover:border-foreground/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-foreground">Front-Running Policy (FINRA 5270)</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  No member or person associated with a member shall cause to be executed an order to buy or sell...
                </p>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Investigation Actions</h3>
              <div className="space-y-1">
                <ActionItem icon={AlertCircle} label="Request Trader Explanation" color="text-yellow-500" />
                <ActionItem icon={CheckCircle} label="Mark as False Positive" color="text-blue-500" />
                <ActionItem icon={Edit2} label="Draft Exception Report" color="text-blue-500" />
              </div>
            </div>

            {/* Table of Contents Quick Links */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trading Workflows</h3>
              <div className="space-y-1 text-sm text-foreground">
                <TocItem num="1" label="Order Routing & Execution" />
                <TocItem num="2" label="Best Execution Reviews" />
                <TocItem num="3" label="Market Making" />
                <TocItem num="4" label="Trade Surveillance" active />
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
