"use client"

import { Shield, Wifi, Lock, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortScanStats } from "@/types/port-scanner"

interface PortScannerStatsProps {
  stats: PortScanStats
}

export function PortScannerStats({ stats }: PortScannerStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.activeSessions}</div>
          <p className="text-xs text-muted-foreground">{stats.totalScans} total scans completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Ports</CardTitle>
          <Wifi className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.openPorts}</div>
          <p className="text-xs text-muted-foreground">Services discovered and accessible</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Filtered Ports</CardTitle>
          <Shield className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.filteredPorts}</div>
          <p className="text-xs text-muted-foreground">Potentially firewalled or filtered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed Ports</CardTitle>
          <Lock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.closedPorts}</div>
          <p className="text-xs text-muted-foreground">Services not running or accessible</p>
        </CardContent>
      </Card>
    </div>
  )
}
