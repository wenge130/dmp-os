import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileJson, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  Bug, 
  ArrowRight,
  Download,
  Fingerprint,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const mockRejections = [
  { id: 'REJ-001', firmROEID: '20240530_ROE123456', type: 'ENO', error: 'Invalid Event Type Code', symbol: 'CZOOF', qty: 1000 },
  { id: 'REJ-002', firmROEID: '20240530_ROE123457', type: 'MENO', error: 'Missing Manual Flag', symbol: 'AAPL', qty: 500 },
  { id: 'REJ-003', firmROEID: '20240530_ROE123458', type: 'MENO', error: 'Invalid Timestamp Format', symbol: 'TSLA', qty: 200 },
];

export const CATReportingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rejections');
  const [repairing, setRepairing] = useState<string | null>(null);
  const [repaired, setRepaired] = useState<string[]>([]);

  const handleRepair = (id: string) => {
    setRepairing(id);
    setTimeout(() => {
      setRepairing(null);
      setRepaired([...repaired, id]);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CAT Reporting & Repair</h1>
          <p className="text-muted-foreground mt-1">FINRA Consolidated Audit Trail message generation, validation, and repair.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync with FINRA
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="rejections" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="rejections" className="gap-2">
            <Bug className="h-4 w-4" />
            Rejections
            <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {mockRejections.length - repaired.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="generate" className="gap-2">
            <FileJson className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Terminal className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rejections" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search firmROEID or Symbol..." className="pl-9 h-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-9 gap-2 border border-border">
                <Filter className="h-4 w-4" />
                Filter Errors
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mockRejections.map((rej) => (
              <Card key={rej.id} className={`transition-all ${repaired.includes(rej.id) ? 'opacity-60 bg-muted/30 border-blue-100' : 'border-orange-100'}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-2 rounded-full ${repaired.includes(rej.id) ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      {repaired.includes(rej.id) ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> : <AlertCircle className="h-5 w-5 text-orange-600" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Firm ROEID</p>
                      <p className="text-sm font-mono font-medium">{rej.firmROEID}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Event Type</p>
                      <Badge variant="outline" className={`text-[10px] py-0 ${rej.type === 'ENO' ? 'text-orange-600 border-orange-200' : ''}`}>{rej.type}</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Error Message</p>
                      <p className={`text-xs font-medium ${repaired.includes(rej.id) ? 'text-blue-600' : 'text-orange-600'}`}>{repaired.includes(rej.id) ? 'Resolved' : rej.error}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Symbol</p>
                      <p className="text-sm font-bold">{rej.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {repaired.includes(rej.id) ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                        Repaired & Re-submitted
                      </Badge>
                    ) : (
                      <Button 
                        onClick={() => handleRepair(rej.id)} 
                        disabled={repairing === rej.id}
                        size="sm" 
                        className="gap-2 bg-foreground text-background hover:bg-foreground/90 h-8"
                      >
                        {repairing === rej.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Bug className="h-3 w-3" />}
                        AI Repair
                      </Button>
                    )}
                  </div>
                </CardContent>
                
                {repairing === rej.id && (
                  <div className="px-4 pb-4">
                    <div className="p-3 bg-muted rounded-lg border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-primary" />
                        <p className="text-[10px] font-mono">
                          <span className="text-blue-500">DMP AI:</span> Changing <span className="text-orange-500">"type": "ENO"</span> to <span className="text-blue-500">"type": "MENO"</span>...
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[8px] animate-pulse">Processing Repair</Badge>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generate" className="pt-4 space-y-6">
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileJson className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Generate New CAT Submission</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload trade data to automatically generate JSON or CSV files formatted to CAT technical specifications.
                </p>
              </div>
              <div className="flex gap-4">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Generate JSON
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Generate CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Repair Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-mono">REJ-001 Repaired</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Today, 10:45 AM</p>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-mono">Batch Submission SUBID_00123</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Yesterday, 4:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
