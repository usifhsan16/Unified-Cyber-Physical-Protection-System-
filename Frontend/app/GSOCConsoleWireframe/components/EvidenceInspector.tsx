import { Camera, FileText, UserCheck, Video } from "lucide-react";
import type { MockAlert } from "../types";

interface EvidenceInspectorProps {
  activeIncident: MockAlert;
  videoTab: "REPLAY" | "LIVE";
  onVideoTabChange: (tab: "REPLAY" | "LIVE") => void;
}

export function EvidenceInspector({
  activeIncident,
  videoTab,
  onVideoTabChange,
}: EvidenceInspectorProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-gsoc-border bg-gsoc-panel lg:col-span-4 lg:row-span-8">
      <div className="flex shrink-0 items-center justify-between border-b border-gsoc-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-purple-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Evidence Replay & Visual Inspector
          </h2>
        </div>

        <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-700 text-[11px]">
          <button
            type="button"
            onClick={() => onVideoTabChange("REPLAY")}
            className={`rounded-md px-2.5 py-0.5 font-medium transition ${
              videoTab === "REPLAY" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            15s Clip
          </button>
          <button
            type="button"
            onClick={() => onVideoTabChange("LIVE")}
            className={`rounded-md px-2.5 py-0.5 font-medium transition ${
              videoTab === "LIVE" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Live WebRTC
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        <div className="relative flex aspect-video w-full shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950">
          <Camera className="h-8 w-8 text-slate-600" />
          <p className="mt-2 text-xs font-medium text-slate-300">
            {videoTab === "REPLAY"
              ? `15s H.264 Evidence Clip (${activeIncident.id})`
              : `Live RTSP/WebRTC Feed (${activeIncident.camera})`}
          </p>
          <p className="text-[10px] text-slate-500">
            10s Pre-Roll + 5s Post-Roll | Placeholder Container
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
            <span className="text-[10px] font-semibold uppercase text-slate-400">
              Live Camera Crop
            </span>
            <div className="mt-1.5 flex h-20 items-center justify-center rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-500">
              Keyframe BBox
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-emerald-400">
              <UserCheck className="h-3 w-3" /> Official HR Photo
            </span>
            <div className="mt-1.5 flex h-20 items-center justify-center rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-500">
              photo_url (EMP-007)
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2">
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[170px]">
            SHA-256: pending_confirmation
          </span>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded bg-blue-600/20 px-2.5 py-1 text-[11px] font-semibold text-blue-300 border border-blue-500/30 hover:bg-blue-600/30"
          >
            <FileText className="h-3.5 w-3.5" />
            Forensic PDF
          </button>
        </div>
      </div>
    </section>
  );
}
