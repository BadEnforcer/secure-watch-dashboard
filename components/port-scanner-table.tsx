"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import type { PortResult, ScanSession } from "@/types/port-scanner"

interface PortScannerTableProps {
  portResults: PortResult[]
  activeSessions: ScanSession[]
}

const statusColors = {
  open: "bg-green-100 text-green-800 border-green-300",
  closed: "bg-gray-100 text-gray-800 border-gray-300",
  filtered: "bg-yellow-100 text-yellow-800 border-yellow-300",
}

const serviceColors: Record<string, string> = {
  HTTP: "bg-blue-100 text-blue-800 border-blue-300",
  HTTPS: "bg-blue-100 text-blue-800 border-blue-300",
  SSH: "bg-purple-100 text-purple-800 border-purple-300",
  FTP: "bg-orange-100 text-orange-800 border-orange-300",
  SMTP: "bg-green-100 text-green-800 border-green-300",
  DNS: "bg-indigo-100 text-indigo-800 border-indigo-300",
  MySQL: "bg-red-100 text-red-800 border-red-300",
  PostgreSQL: "bg-red-100 text-red-800 border-red-300",
  RDP: "bg-pink-100 text-pink-800 border-pink-300",
}

export function PortScannerTable({ portResults, activeSessions }: PortScannerTableProps) {
  return (
    <div className="space-y-6">
      {/* Active Scans Section */}
      {activeSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Port Scans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      {session.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{session.targetIp}</span>
                    <span className="text-xs text-gray-500">
                      Ports {session.startPort}-{session.endPort}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {session.scannedPorts}/{session.totalPorts} ports
                  </span>
                </div>
                <Progress value={session.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Port Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Port Scan Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-1 p-4">
              {portResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No port scan results available</div>
              ) : (
                portResults.map((result, index) => (
                  <div
                    key={`${result.targetIp}-${result.port}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={`text-xs border ${statusColors[result.status]}`}>
                          {result.status.toUpperCase()}
                        </Badge>
                        {result.service && (
                          <Badge
                            className={`text-xs border ${
                              serviceColors[result.service] || "bg-gray-100 text-gray-800 border-gray-300"
                            }`}
                          >
                            {result.service}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">{result.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">
                          {result.targetIp}:{result.port}
                        </span>
                        <span className="text-sm text-gray-600 truncate">
                          {result.banner !== "Not Available" ? result.banner : "No banner"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm ${
                          result.status === "open"
                            ? "bg-green-500"
                            : result.status === "filtered"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                        title={`Status: ${result.status}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
