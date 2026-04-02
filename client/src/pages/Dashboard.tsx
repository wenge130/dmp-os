import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HelpCircle, 
  CheckCircle, 
  LayoutDashboard, 
  MessageSquare, 
  Activity
} from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import CommandCenter from "@/components/CommandCenter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden animate-in fade-in duration-700">
      {/* Top Header */}
      <div className="h-14 border-b border-border/50 flex items-center justify-between px-6 shrink-0 bg-card/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">D</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="bg-transparent h-14 border-none gap-4">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-14 px-1 gap-2 text-xs font-medium"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Command Center
              </TabsTrigger>
              <TabsTrigger 
                value="assistant" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-14 px-1 gap-2 text-xs font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                AI Assistant
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            WG
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsContent value="overview" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <CommandCenter />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="assistant" className="flex-1 m-0 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1">
                <div className="max-w-5xl mx-auto pt-12 pb-32 px-8">
                  {/* Chat Content */}
                  <div className="space-y-8 mb-12">
                    <div className="flex gap-4 items-start animate-in slide-in-from-left duration-500">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="text-[10px] font-bold text-primary">D</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Welcome back, @Wen.</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The system is synchronized with the latest FINRA Rule Book and SEC filings. I've processed the morning's trade data and verified compliance standings across all departments. How can I assist you today?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start justify-end animate-in slide-in-from-right duration-500">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                        <p className="text-sm">Analyze the last block trade for potential Rule 3110 implications.</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
                        <span className="text-[10px] font-bold">WG</span>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start animate-in slide-in-from-left duration-500 delay-200">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="text-[10px] font-bold text-primary">D</span>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-4">
                          <p className="text-sm font-bold flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            Analyzing Trade Life Cycle
                          </p>
                          
                          {/* Inline Cascade Preview */}
                          <div className="space-y-2 pl-3 border-l-2 border-primary/20">
                            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-md bg-green-50/30">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                <span>Trade Execution Data Verified</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-md bg-green-50/30">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                <span>AML/KYC Check Cleared</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-md bg-primary/5 border border-primary/20">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                <span className="font-bold text-primary">Digital Ledger Fingerprinted</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground pt-2">
                            The trade (ID: 88492) is in full compliance with FINRA Rule 3110 and your internal WSPs. A permanent cryptographic hash has been printed to the system ledger.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="w-full">
                    <ChatInput 
                      query={query} 
                      setQuery={setQuery} 
                      placeholder="Ask DMP anything..." 
                    />
                    <p className="text-center text-[10px] text-muted-foreground mt-4 font-normal">
                      DMP AI is currently monitoring Tech, FINOP, and Compliance data feeds.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-8 border-t border-border/50 flex items-center justify-between px-6 shrink-0 bg-card/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Connected to FINRA API
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            SEC EDGAR Sync Active
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground">
          <span>v2.1.0-stable</span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Help
          </span>
        </div>
      </div>
    </div>
  );
}
