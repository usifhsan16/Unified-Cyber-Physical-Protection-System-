import { Activity } from "lucide-react";

interface RulePrecision {
  rule: string;
  precision: number;
  threshold: string;
}

interface LiveKpisProps {
  rules: RulePrecision[];
}

export function LiveKpis({ rules }: LiveKpisProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-gsoc-border bg-gsoc-panel lg:col-span-9 lg:row-span-4">
      <div className="flex shrink-0 items-center justify-between border-b border-gsoc-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Live System KPIs & Per-Rule Precision Scorecard
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Feedback Loop Calibration Telemetry
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 md:grid-cols-12">
        <div className="grid grid-cols-3 gap-2 md:col-span-4">
          <div className="flex flex-col justify-center rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
            <span className="text-[10px] uppercase text-slate-400">WS Latency</span>
            <span className="mt-1 font-mono text-lg font-bold text-emerald-400">38 ms</span>
            <span className="text-[10px] text-slate-500">Target &lt; 200ms</span>
          </div>
          <div className="flex flex-col justify-center rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
            <span className="text-[10px] uppercase text-slate-400">Active Cameras</span>
            <span className="mt-1 font-mono text-lg font-bold text-blue-400">3 / 3</span>
            <span className="text-[10px] text-slate-500">30 FPS Stream</span>
          </div>
          <div className="flex flex-col justify-center rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
            <span className="text-[10px] uppercase text-slate-400">Open Tickets</span>
            <span className="mt-1 font-mono text-lg font-bold text-red-400">2</span>
            <span className="text-[10px] text-slate-500">1 Awaiting Triage</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 md:col-span-8">
          {rules.map((item) => {
            const isNoisy = item.precision < 85;
            return (
              <div
                key={item.rule}
                className={`flex flex-col justify-between rounded-lg border p-2.5 ${
                  isNoisy
                    ? "border-amber-500/40 bg-amber-950/20"
                    : "border-slate-800 bg-slate-900/70"
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-mono text-[10px] font-semibold text-slate-200 break-all">
                    {item.rule}
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                      isNoisy
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {item.precision}%
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  Threshold: <span className="text-slate-300">{item.threshold}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
