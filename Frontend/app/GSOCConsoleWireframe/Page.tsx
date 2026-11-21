"use client";

import { useState } from "react";
import { MOCK_ALERTS, MOCK_RULES_PRECISION } from "./data";
import { ActiveIncidents } from "./components/ActiveIncidents";
import { ConsoleHeader } from "./components/ConsoleHeader";
import { EvidenceInspector } from "./components/EvidenceInspector";
import { FloorPlan } from "./components/FloorPlan";
import { LiveKpis } from "./components/LiveKpis";

export default function GSOCConsoleWireframe() {
  const [selectedIncidentId, setSelectedIncidentId] = useState(MOCK_ALERTS[0].id);
  const [videoTab, setVideoTab] = useState<"REPLAY" | "LIVE">("REPLAY");
  const activeIncident =
    MOCK_ALERTS.find((alert) => alert.id === selectedIncidentId) || MOCK_ALERTS[0];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gsoc-bg text-slate-100 select-none">
      <ConsoleHeader />

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-12 lg:grid-rows-12">
        <ActiveIncidents
          alerts={MOCK_ALERTS}
          selectedIncidentId={selectedIncidentId}
          onSelectIncident={setSelectedIncidentId}
        />
        <FloorPlan activeIncident={activeIncident} />
        <EvidenceInspector
          activeIncident={activeIncident}
          videoTab={videoTab}
          onVideoTabChange={setVideoTab}
        />
        <LiveKpis rules={MOCK_RULES_PRECISION} />
      </main>
    </div>
  );
}