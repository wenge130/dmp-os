import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plus, 
  ArrowRight, 
  Settings2, 
  Wand2, 
  FileText, 
  Globe, 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  UploadCloud,
  Folder,
  Briefcase,
  Search,
  X,
  AlignLeft,
  SlidersHorizontal,
  RefreshCw,
  Database,
  Shield,
  FileSearch,
  Activity,
  UserCheck,
  CreditCard,
  BarChart3,
  Scale,
  Sparkles,
  Zap,
  Send
} from "lucide-react";
import { WorkflowCascade } from "./WorkflowCascade";

interface ChatInputProps {
  query: string;
  setQuery: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function ChatInput({ query, setQuery, onSubmit, placeholder = "Ask DMP anything..." }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedSources, setSelectedSources] = useState<{id: string, label: string, type: 'file' | 'web' | 'feed'}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCascade, setShowCascade] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [query]);

  const addSource = (id: string, label: string, type: 'file' | 'web' | 'feed') => {
    if (!selectedSources.find(s => s.id === id)) {
      setSelectedSources([...selectedSources, { id, label, type }]);
    }
  };

  const removeSource = (id: string) => {
    setSelectedSources(selectedSources.filter(s => s.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!query.trim() && selectedSources.length === 0) return;
    
    setIsProcessing(true);
    setShowCascade(true);
    
    // In a real app, this would send to an API
    if (onSubmit) {
      // Simulate API call delay for the cascade animation
      setTimeout(() => {
        setIsProcessing(false);
        setQuery("");
        onSubmit();
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      {/* Workflow Cascade Visualization */}
      {showCascade && (
        <div className="bg-white border border-border/50 rounded-xl p-6 shadow-sm mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold">DMP AI Workflow Cascade</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowCascade(false)} className="h-6 text-[10px]">Close</Button>
          </div>
          <WorkflowCascade active={showCascade} onComplete={() => setIsProcessing(false)} />
        </div>
      )}

      {/* Main Input Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-all flex flex-col">
        
        {/* Selected Sources Tags */}
        {selectedSources.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
            {selectedSources.map(source => (
              <div key={source.id} className="flex items-center gap-1.5 px-2 py-1 bg-background border border-border rounded-md text-xs font-medium text-foreground shadow-sm">
                {source.type === 'file' ? <FileText className="w-3 h-3 text-orange-500" /> : source.type === 'web' ? <Globe className="w-3 h-3 text-blue-500" /> : <Database className="w-3 h-3 text-blue-500" />}
                {source.label}
                <button onClick={() => removeSource(source.id)} className="ml-1 text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full resize-none bg-transparent border-none focus:ring-0 px-4 ${selectedSources.length > 0 ? 'pt-0 pb-4' : 'py-4'} text-base text-foreground placeholder:text-muted-foreground min-h-[120px] max-h-[250px] overflow-y-auto outline-none`}
          rows={1}
        />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/50 bg-secondary/20">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {/* Files and Sources Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md px-2 gap-1.5 whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Files and sources</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-2 max-h-[400px] overflow-y-auto" sideOffset={8}>
                <div className="space-y-1">
                  <DropdownItem icon={UploadCloud} label="Upload files" />
                  <DropdownItem icon={BookOpen} label="Add from Manuals" />
                  <DropdownItem icon={ShieldCheck} label="Add from WSP" hasSubmenu />
                  
                  <div className="h-px bg-border my-2" />
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">Secure @Protocol Sources</p>
                  
                  <DropdownItem icon={BookOpen} label="@rulebook" isAtSign onClick={() => addSource('rulebook', '@rulebook', 'feed')} />
                  <DropdownItem icon={Shield} label="@finra" isAtSign onClick={() => addSource('finra', '@finra', 'feed')} />
                  <DropdownItem icon={BarChart3} label="@focus" isAtSign onClick={() => addSource('focus', '@focus', 'feed')} />
                  <DropdownItem icon={FileText} label="@audited" isAtSign onClick={() => addSource('audited', '@audited', 'feed')} />
                  <DropdownItem icon={Building2} label="@sec" isAtSign onClick={() => addSource('sec', '@sec', 'feed')} />
                  <DropdownItem icon={Scale} label="@public" isAtSign onClick={() => addSource('public', '@public', 'feed')} />
                  <DropdownItem icon={Activity} label="@trade" isAtSign onClick={() => addSource('trade', '@trade', 'feed')} />
                  <DropdownItem icon={UserCheck} label="@customer" isAtSign onClick={() => addSource('customer', '@customer', 'feed')} />
                  <DropdownItem icon={CreditCard} label="@aml" isAtSign onClick={() => addSource('aml', '@aml', 'feed')} />
                  <DropdownItem icon={Globe} label="Web search" onClick={() => addSource('web', 'Web search', 'web')} />
                </div>
              </PopoverContent>
            </Popover>

            <div className="h-3 w-px bg-border/50 mx-1 flex-shrink-0"></div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md px-2 gap-1.5 whitespace-nowrap"
              onClick={handleSend}
            >
              <Zap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">Analyze</span>
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              size="sm"
              onClick={handleSend}
              disabled={(!query.trim() && selectedSources.length === 0) || isProcessing}
              variant={(query.trim() || selectedSources.length > 0) && !isProcessing ? "default" : "ghost"}
              className="h-8 text-xs font-medium rounded-md px-3 gap-1.5 whitespace-nowrap"
            >
              {isProcessing ? (
                <>
                  <div className="h-3 w-3 border-2 border-current opacity-30 border-t-current rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Ask DMP"
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-center text-muted-foreground/60">
        DMP AI is currently monitoring <span className="font-bold">12 data feeds</span> across <span className="font-bold">Compliance, HR, and Finance</span>.
      </p>
    </div>
  );
}

function DropdownItem({ icon: Icon, label, hasSubmenu = false, onClick, isAtSign = false }: { icon: any, label: string, hasSubmenu?: boolean, onClick?: () => void, isAtSign?: boolean }) {
  return (
    <div 
      className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary cursor-pointer group text-sm text-foreground transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {isAtSign ? (
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">@</div>
        ) : (
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
        <span className={isAtSign ? "font-mono text-blue-600" : ""}>{label}</span>
      </div>
      {hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </div>
  );
}
