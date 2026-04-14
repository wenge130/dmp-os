import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface ComplianceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ComplianceDetailsModal({ open, onOpenChange }: ComplianceDetailsModalProps) {
  const complianceMetrics = [
    { category: "Trading Supervision", score: 98, status: "excellent" },
    { category: "Customer Protection (15c3-3)", score: 94, status: "excellent" },
    { category: "Net Capital (15c3-1)", score: 91, status: "good" },
    { category: "Best Execution (Rule 5310)", score: 87, status: "good" },
    { category: "Anti-Money Laundering", score: 96, status: "excellent" },
    { category: "Counterparty Risk Management", score: 89, status: "good" },
    { category: "Market Access (15c3-5)", score: 93, status: "excellent" },
    { category: "Supervisory Procedures", score: 95, status: "excellent" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Compliance Alignment Details</DialogTitle>
          <DialogDescription>
            Detailed breakdown of regulatory compliance across all business lines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {complianceMetrics.map((metric, idx) => (
            <Card key={idx} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{metric.category}</h4>
                  <Badge 
                    variant={metric.status === "excellent" ? "default" : "secondary"}
                    className={metric.status === "excellent" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {metric.score}%
                  </Badge>
                </div>
                <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {metric.status === "excellent" ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-warning" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {metric.status === "excellent" ? "Exceeds expectations" : "Meets requirements"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
              <p className="text-2xl font-bold text-foreground">93%</p>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">↑ 2% this month</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
