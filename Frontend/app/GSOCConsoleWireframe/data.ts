import type { MockAlert } from "./types";

export const MOCK_ALERTS: MockAlert[] = [
  {
    id: "INC-2026-10482",
    severity: "CRITICAL",
    title: "UNAUTHORIZED_ZONE_ENTRY + DOOR_TAMPERING",
    zone: "SERVER_ROOM",
    camera: "CAM-03",
    subject: "Ahmed Ali (EMP-007)",
    timestamp: "21:04:12 UTC",
    status: "OPEN",
  },
  {
    id: "INC-2026-10481",
    severity: "HIGH",
    title: "TAILGATING_DETECTED",
    zone: "MAIN_CORRIDOR_GATE",
    camera: "CAM-01",
    subject: "Unknown + EMP-012",
    timestamp: "20:51:08 UTC",
    status: "OPEN",
  },
  {
    id: "INC-2026-10479",
    severity: "MEDIUM",
    title: "LOITERING_DETECTED",
    zone: "RESTRICTED_VAULT_DOOR",
    camera: "CAM-02",
    subject: "Unknown (Track #42)",
    timestamp: "20:33:45 UTC",
    status: "CLOSED",
  },
];

export const MOCK_RULES_PRECISION = [
  { rule: "UNAUTHORIZED_ZONE_ENTRY", precision: 96.4, threshold: "1.0s debounce" },
  { rule: "BADGE_SWAPPING_DETECTED", precision: 94.1, threshold: "sim < 0.65" },
  { rule: "TAILGATING_DETECTED", precision: 91.0, threshold: ">= 2 bodies / 4.0s" },
  { rule: "LOITERING_DETECTED", precision: 78.5, threshold: "d <= 3.0m, 120s" },
];
