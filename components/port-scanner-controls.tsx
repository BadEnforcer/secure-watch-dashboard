"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Square } from "lucide-react"

interface PortScannerControlsProps {
  onStartScan: (targetIp: string, startPort: number, endPort: number) => void
  isScanning: boolean
}

export function PortScannerControls({ onStartScan, isScanning }: PortScannerControlsProps) {
  const [targetIp, setTargetIp] = useState("127.0.0.1")
  const [startPort, setStartPort] = useState("1")
  const [endPort, setEndPort] = useState("5000")

  const handleStartScan = () => {
    const start = Number.parseInt(startPort, 10)
    const end = Number.parseInt(endPort, 10)

    if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
      alert("Invalid port range. Ports must be between 1-65535 and start port must be <= end port.")
      return
    }

    if (end - start > 10000) {
      alert("Port range too large. Maximum 10,000 ports per scan.")
      return
    }

    onStartScan(targetIp, start, end)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Port Scanner Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="targetIp" className="block text-xs font-medium text-gray-700 mb-1">
              Target IP
            </label>
            <Input
              id="targetIp"
              value={targetIp}
              onChange={(e) => setTargetIp(e.target.value)}
              placeholder="192.168.1.1"
              disabled={isScanning}
            />
          </div>
          <div>
            <label htmlFor="startPort" className="block text-xs font-medium text-gray-700 mb-1">
              Start Port
            </label>
            <Input
              id="startPort"
              value={startPort}
              onChange={(e) => setStartPort(e.target.value)}
              placeholder="1"
              type="number"
              min="1"
              max="65535"
              disabled={isScanning}
            />
          </div>
          <div>
            <label htmlFor="endPort" className="block text-xs font-medium text-gray-700 mb-1">
              End Port
            </label>
            <Input
              id="endPort"
              value={endPort}
              onChange={(e) => setEndPort(e.target.value)}
              placeholder="1000"
              type="number"
              min="1"
              max="65535"
              disabled={isScanning}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleStartScan} disabled={isScanning} className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>{isScanning ? "Scanning..." : "Start Scan"}</span>
          </Button>
          {isScanning && (
            <Button variant="outline" disabled>
              <Square className="h-4 w-4 mr-2" />
              Stop Scan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
