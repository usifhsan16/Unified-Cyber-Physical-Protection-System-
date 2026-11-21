import { MapPin } from "lucide-react";
import type { MockAlert } from "../types";

interface FloorPlanProps {
  activeIncident: MockAlert;
}

export function FloorPlan({ activeIncident }: FloorPlanProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-gsoc-border bg-gsoc-panel lg:col-span-5 lg:row-span-8">
      <div className="flex shrink-0 items-center justify-between border-b border-gsoc-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Interactive Architectural SVG Floor Plan (Floor 01)
          </h2>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Scale: 40px = 1.0m
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-950/70 p-4">
        <svg
          viewBox="0 0 600 340"
          className="h-full w-full max-h-full max-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="340" fill="url(#grid)" />

          <rect x="30" y="30" width="180" height="120" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <text x="45" y="55" fill="#94a3b8" fontSize="12" fontWeight="bold">
            PUBLIC LOBBY
          </text>

          <rect x="230" y="30" width="340" height="120" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
          <text x="245" y="55" fill="#60a5fa" fontSize="12" fontWeight="bold">
            EMPLOYEE CORRIDOR (TIER 2)
          </text>

          <rect x="350" y="180" width="220" height="130" rx="6" fill="#450a0a" fillOpacity="0.45" stroke="#ef4444" strokeWidth="3" className="animate-pulse" />
          <text x="365" y="205" fill="#fca5a5" fontSize="12" fontWeight="bold">
            SERVER ROOM (RESTRICTED)
          </text>
          <text x="365" y="222" fill="#f87171" fontSize="10">
            BREACH: {activeIncident.id}
          </text>

          <polyline points="260,110 310,125 370,150 420,245" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,5" />
          <circle cx="260" cy="110" r="3" fill="#f59e0b" opacity="0.5" />
          <circle cx="310" cy="125" r="3.5" fill="#f59e0b" opacity="0.7" />
          <circle cx="370" cy="150" r="4" fill="#f59e0b" opacity="0.85" />

          <circle cx="420" cy="245" r="12" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
          <circle cx="420" cy="245" r="6" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
          <text x="432" y="249" fill="#ffffff" fontSize="11" fontWeight="bold">
            EMP-007 (14.2m, 8.5m)
          </text>
        </svg>

        <div className="absolute bottom-2 left-3 flex flex-wrap gap-3 rounded-md border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-[10px] text-slate-300">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Suspect Pos
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 bg-amber-400" /> 10s Trajectory
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 border border-red-500 bg-red-950" /> Breached Zone
          </span>
        </div>
      </div>
    </section>
  );
}
