export interface MockAlert {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  title: string;
  zone: string;
  camera: string;
  subject: string;
  timestamp: string;
  status: "OPEN" | "CLOSED";
}
