import { CheckCircle2, XCircle } from "lucide-react";
import type { MockAlert } from "../types";

interface ActiveIncidentsProps {
  alerts: MockAlert[];
  selectedIncidentId: string;
  onSelectIncident: (incidentId: string) => void;
}

export function ActiveIncidents({
  alerts,
  selectedIncidentId,
  onSelectIncident,
}: ActiveIncidentsProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-gsoc-border bg-gsoc-panel lg:col-span-3 lg:row-span-12">
      <div className="flex shrink-0 items-center justify-between border-b border-gsoc-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse-fast" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Active Incidents ({alerts.length})
          </h2>
        </div>
        <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
          LIVE TRIAGE
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {alerts.map((alert) => {
          const isSelected = alert.id === selectedIncidentId;
          return (
            <div
              key={alert.id}
              onClick={() => onSelectIncident(alert.id)}
              className={`cursor-pointer rounded-lg border p-3 transition-all ${
                isSelected
                  ? "border-red-500 bg-red-950/30 shadow-lg shadow-red-950/20"
                  : "border-slate-700/70 bg-slate-900/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-white">
                  {alert.id}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    alert.severity === "CRITICAL"
                      ? "bg-red-600 text-white animate-pulse"
                      : alert.severity === "HIGH"
                      ? "bg-amber-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="mt-1.5 text-xs font-semibold text-red-300 break-words">
                {alert.title}
              </p>

              <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Zone:</span>
                  <span className="font-mono text-slate-200">{alert.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Camera:</span>
                  <span className="font-mono text-slate-200">{alert.camera}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subject:</span>
                  <span className="text-slate-200 truncate max-w-[140px]">
                    {alert.subject}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-2.5">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1 rounded bg-emerald-600/20 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confirm
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1 rounded bg-slate-700/40 py-1 text-[11px] font-semibold text-slate-300 border border-slate-600/40 hover:bg-slate-700/60"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  False Alarm
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
