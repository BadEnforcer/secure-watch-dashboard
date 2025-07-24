export interface MouseDataPoint {
  x: number
  y: number
  timestamp: Date
}

export interface HeatmapConfig {
  enabled: boolean
  maxPoints: number
  radius: number
  opacity: number
  gradient: Record<string, string>
}
