import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRightLeft, 
  History,
  Search,
  ArrowRight,
  Fingerprint
} from 'lucide-react';

const mockDiscrepancies = [
  { id: 1, symbol: 'AAPL', side: 'BUY', brokerQty: 1000, streetQty: 950, diff: -50, price: 175.50, status: 'Open' },
  { id: 2, symbol: 'TSLA', side: 'SELL', brokerQty: 500, streetQty: 500, diff: 0, price: 240.20, status: 'Matched' },
  { id: 3, symbol: 'NVDA', side: 'BUY', brokerQty: 200, streetQty: 205, diff: 5, price: 480.15, status: 'Open' },
];

export const ReconciliationModule: React.FC = () => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (nextStep: number) => {
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setUploading(false);
        setStep(nextStep);
        setProgress(0);
      }
    }, 100);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Basic Reconciliation</h1>
          <p className="text-muted-foreground mt-1">Compare "Broker" vs "Street" trade files to identify and repair discrepancies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            History
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Fingerprint className="h-4 w-4" />
            Audit Log
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg border-2 transition-all ${step >= 1 ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
            <p className="text-xs font-semibold uppercase tracking-wider">Broker File</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Upload internal trade blotter</p>
        </div>
        <div className={`p-4 rounded-lg border-2 transition-all ${step >= 2 ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
            <p className="text-xs font-semibold uppercase tracking-wider">Street File</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Upload clearing firm data</p>
        </div>
        <div className={`p-4 rounded-lg border-2 transition-all ${step >= 3 ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
            <p className="text-xs font-semibold uppercase tracking-wider">Analysis</p>
          </div>
          <p className="text-[10px] text-muted-foreground">AI discrepancy detection</p>
        </div>
        <div className={`p-4 rounded-lg border-2 transition-all ${step >= 4 ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>4</div>
            <p className="text-xs font-semibold uppercase tracking-wider">Repair</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Automated correction</p>
        </div>
      </div>

      {step === 1 && (
        <Card className="border-dashed border-2 py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Upload Broker Trade File</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Select your internal trade file (CSV/XLSX) to initiate the daily reconciliation process.
              </p>
            </div>
            {uploading ? (
              <div className="w-full max-w-xs space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-[10px] text-center text-muted-foreground">Ingesting data...</p>
              </div>
            ) : (
              <Button onClick={() => handleUpload(2)} className="gap-2">
                <Search className="h-4 w-4" />
                Select File
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-dashed border-2 py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <ArrowRightLeft className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Upload Street Trade File</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Now upload the corresponding file from your clearing firm or counterparty.
              </p>
            </div>
            {uploading ? (
              <div className="w-full max-w-xs space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-[10px] text-center text-muted-foreground">Running cross-comparison...</p>
              </div>
            ) : (
              <Button onClick={() => handleUpload(3)} variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                <Upload className="h-4 w-4" />
                Select Street File
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Discrepancy Report Identified
            </h2>
            <Button onClick={() => setStep(4)} size="sm" className="gap-2">
              Resolve All Breaks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {mockDiscrepancies.map((item) => (
              <Card key={item.id} className={item.diff !== 0 ? 'border-amber-200 bg-amber-50/30' : 'border-green-100'}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Symbol</p>
                      <p className="text-sm font-bold">{item.symbol}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Side</p>
                      <Badge variant="outline" className="text-[10px] py-0">{item.side}</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Broker Qty</p>
                      <p className="text-sm">{item.brokerQty.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-center px-2">
                      <ArrowRightLeft className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Street Qty</p>
                      <p className="text-sm">{item.streetQty.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Difference</p>
                      <p className={`text-sm font-bold ${item.diff === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.diff > 0 ? `+${item.diff}` : item.diff}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.diff !== 0 ? (
                      <>
                        <Button variant="ghost" size="sm" className="text-[10px] h-7 px-2 border border-amber-200 bg-white">Trust Broker</Button>
                        <Button variant="ghost" size="sm" className="text-[10px] h-7 px-2 border border-amber-200 bg-white">Trust Street</Button>
                      </>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Matched
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-green-800">Reconciliation Complete</h3>
              <p className="text-sm text-green-700 max-w-md mx-auto">
                All trade breaks have been resolved. The corrected entries have been "fingerprinted" and pushed to the Digital Ledger for audit.
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="border-green-200 text-green-700 hover:bg-green-100">
                Start New Recon
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                View Audit Log
              </Button>
            </div>
            <div className="pt-4 border-t border-green-200 w-full max-w-sm text-center">
              <p className="text-[10px] text-green-600/60 font-mono">
                BLOCK HASH: 0x82f...d4e | OPERATOR: @artie | REVIEWER: @roger
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
