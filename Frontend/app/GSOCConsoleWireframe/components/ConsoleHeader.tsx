import { Clock, ShieldAlert, Wifi } from "lucide-react";

export function ConsoleHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-gsoc-border bg-gsoc-panel px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">
            UCPPS — GSOC Physical Security Console
          </h1>
          <p className="text-[11px] text-slate-400">
            Unified Cyber-Physical Protection System | Layer 3 Triage Interface
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400 border border-emerald-500/20">
          <Wifi className="h-3.5 w-3.5" />
          WS Stream: Connected (Wireframe)
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono">
          <Clock className="h-3.5 w-3.5" />
          NTP SYNC: UTC
        </span>
      </div>
    </header>
  );
}
