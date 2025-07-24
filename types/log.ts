export type LogLevel = "INFO" | "WARNING" | "ERROR" | "CRITICAL" | "DEBUG"

export interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  category: ThreatCategory
  severity: number
}

export type ThreatCategory =
  | "Authentication"
  | "Network Security"
  | "Malware Detection"
  | "System Events"
  | "Access Control"

export interface LogStats {
  total: number
  byLevel: Record<LogLevel, number>
  byCategory: Record<ThreatCategory, number>
  recentThreats: number
}

export interface FilterOptions {
  levels: LogLevel[]
  categories: ThreatCategory[]
  timeRange: "1h" | "6h" | "24h" | "7d"
  searchQuery: string
}
