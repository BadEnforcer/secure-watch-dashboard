export interface PortResult {
  port: number
  banner: string
  status: "open" | "closed" | "filtered"
  service?: string
  timestamp: Date
  targetIp: string
}

export interface ScanSession {
  id: string
  targetIp: string
  startPort: number
  endPort: number
  startTime: Date
  endTime?: Date
  status: "running" | "completed" | "paused" | "error"
  progress: number
  totalPorts: number
  scannedPorts: number
}

export interface PortScanStats {
  totalScans: number
  activeSessions: number
  openPorts: number
  closedPorts: number
  filteredPorts: number
  commonServices: Record<string, number>
  recentScans: ScanSession[]
}
