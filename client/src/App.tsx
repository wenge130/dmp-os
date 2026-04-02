import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import WSPManagement from "./pages/WSPManagement";
import SupervisoryWorkflows from "./pages/SupervisoryWorkflows";
import RegulatoryReporting from "./pages/RegulatoryReporting";
import Sidebar from "./components/Sidebar";
import { Dashboard606 } from "./components/Dashboard606";
import { ReconciliationModule } from "./components/ReconciliationModule";
import { CATReportingModule } from "./components/CATReportingModule";
import { NetCapitalModule } from "./components/NetCapitalModule";
import { RiskDashboard } from "./components/RiskDashboard";
import { MAGModule } from "./components/MAGModule";
import { OperationsCenter } from "./components/OperationsCenter";
import { ArchiveRecords } from "./components/ArchiveRecords";
import { OperationalAnalytics } from "./components/OperationalAnalytics";
import { TechStatus } from "./components/TechStatus";
import { DataFeeds } from "./components/DataFeeds";
import ComplianceAnalyzer from "./components/ComplianceAnalyzer";
import OperationalCascadeView from "./components/OperationalCascadeView";
import DigitalLedgerView from "./components/DigitalLedgerView";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/wsp"} component={WSPManagement} />
      <Route path={"/workflows"} component={SupervisoryWorkflows} />
      <Route path={"/reporting"} component={RegulatoryReporting} />
      <Route path={"/606-dashboard"} component={Dashboard606} />
      <Route path={"/reconciliation"} component={ReconciliationModule} />
      <Route path={"/cat-reporting"} component={CATReportingModule} />
      <Route path={"/net-capital"} component={NetCapitalModule} />
      <Route path={"/risk-mgmt"} component={RiskDashboard} />
      <Route path={"/mag"} component={MAGModule} />
      <Route path={"/brokerage-ops"} component={OperationsCenter} />
      <Route path={"/books-records"} component={ArchiveRecords} />
      <Route path={"/analytics"} component={OperationalAnalytics} />
      <Route path={"/tech"} component={TechStatus} />
      <Route path={"/data"} component={DataFeeds} />
      <Route path={"/compliance-analyzer"} component={ComplianceAnalyzer} />
      <Route path={"/operational-cascade"} component={OperationalCascadeView} />
      <Route path={"/ledger"} component={DigitalLedgerView} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base="/dmp-os">
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <div className="flex h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-hidden relative bg-[#FBFBFB]">
              <Router />
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
    </WouterRouter>
  );
}

export default App;
