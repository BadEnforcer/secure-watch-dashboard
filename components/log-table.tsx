"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { LogEntry, LogLevel, ThreatCategory } from "@/types/log"

interface LogTableProps {
  logs: LogEntry[]
}

const levelColors: Record<LogLevel, string> = {
  DEBUG: "bg-gray-100 text-gray-800 border-gray-300",
  INFO: "bg-blue-100 text-blue-800 border-blue-300",
  WARNING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  ERROR: "bg-red-100 text-red-800 border-red-300",
  CRITICAL: "bg-red-200 text-red-900 border-red-400",
}

const categoryColors: Record<ThreatCategory, string> = {
  Authentication: "bg-purple-100 text-purple-800 border-purple-300",
  "Network Security": "bg-green-100 text-green-800 border-green-300",
  "Malware Detection": "bg-red-100 text-red-800 border-red-300",
  "System Events": "bg-blue-100 text-blue-800 border-blue-300",
  "Access Control": "bg-orange-100 text-orange-800 border-orange-300",
}

const severityIndicatorColors: Record<number, string> = {
  1: "bg-gray-400", // DEBUG
  2: "bg-blue-500", // INFO
  3: "bg-yellow-500", // WARNING
  4: "bg-red-500", // ERROR
  5: "bg-red-600", // CRITICAL
}

export function LogTable({ logs }: LogTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Security Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-4">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No logs match the current filters</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`text-xs border ${levelColors[log.level]}`}>{log.level}</Badge>
                      <Badge className={`text-xs border ${categoryColors[log.category]}`}>{log.category}</Badge>
                      <span className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-900 truncate">{log.message}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${severityIndicatorColors[log.severity]} shadow-sm`}
                      title={`Severity: ${log.severity}/5`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
