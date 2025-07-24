import type { LogEntry, LogLevel, ThreatCategory } from "@/types/log"

export interface TimeSeriesData {
  time: string
  hour: number
  DEBUG: number
  INFO: number
  WARNING: number
  ERROR: number
  CRITICAL: number
  total: number
}

export interface CategoryTimeData {
  time: string
  hour: number
  Authentication: number
  "Network Security": number
  "Malware Detection": number
  "System Events": number
  "Access Control": number
  total: number
}

export function aggregateLogsByHour(logs: LogEntry[]): TimeSeriesData[] {
  const hourlyData = new Map<number, Record<LogLevel, number>>()

  // Initialize 24 hours of data
  for (let i = 0; i < 24; i++) {
    hourlyData.set(i, {
      DEBUG: 0,
      INFO: 0,
      WARNING: 0,
      ERROR: 0,
      CRITICAL: 0,
    })
  }

  // Aggregate logs by hour
  logs.forEach((log) => {
    const hour = log.timestamp.getHours()
    const hourData = hourlyData.get(hour)!
    hourData[log.level]++
  })

  // Convert to array format for charts
  return Array.from(hourlyData.entries()).map(([hour, data]) => ({
    time: `${hour.toString().padStart(2, "0")}:00`,
    hour,
    ...data,
    total: Object.values(data).reduce((sum, count) => sum + count, 0),
  }))
}

export function aggregateCategoriesByHour(logs: LogEntry[]): CategoryTimeData[] {
  const hourlyData = new Map<number, Record<ThreatCategory, number>>()

  // Initialize 24 hours of data
  for (let i = 0; i < 24; i++) {
    hourlyData.set(i, {
      Authentication: 0,
      "Network Security": 0,
      "Malware Detection": 0,
      "System Events": 0,
      "Access Control": 0,
    })
  }

  // Aggregate logs by hour
  logs.forEach((log) => {
    const hour = log.timestamp.getHours()
    const hourData = hourlyData.get(hour)!
    hourData[log.category]++
  })

  // Convert to array format for charts
  return Array.from(hourlyData.entries()).map(([hour, data]) => ({
    time: `${hour.toString().padStart(2, "0")}:00`,
    hour,
    ...data,
    total: Object.values(data).reduce((sum, count) => sum + count, 0),
  }))
}
