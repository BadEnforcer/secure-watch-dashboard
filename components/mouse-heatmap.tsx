"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Eye, EyeOff, RotateCcw, Download } from "lucide-react"
import type { MouseDataPoint, HeatmapConfig } from "@/types/mouse-heatmap"

interface MouseHeatmapProps {
  className?: string
}

export function MouseHeatmap({ className }: MouseHeatmapProps) {
  const [mouseData, setMouseData] = useState<MouseDataPoint[]>([])
  const [config, setConfig] = useState<HeatmapConfig>({
    enabled: true,
    maxPoints: 5000,
    radius: 25,
    opacity: 0.6,
    gradient: {
      0.0: "rgba(0, 0, 255, 0)",
      0.2: "rgba(0, 0, 255, 0.5)",
      0.4: "rgba(0, 255, 0, 0.8)",
      0.6: "rgba(255, 255, 0, 0.9)",
      0.8: "rgba(255, 165, 0, 1)",
      1.0: "rgba(255, 0, 0, 1)",
    },
  })
  const [showHeatmap, setShowHeatmap] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle mouse move events within the canvas container
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!config.enabled || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newDataPoint: MouseDataPoint = {
      x,
      y,
      timestamp: new Date(),
    }

    setMouseData((prevData) => {
      const updatedData = [...prevData, newDataPoint]
      return updatedData.slice(-config.maxPoints)
    })
  }

  // Remove the useEffect for mouse tracking since we're using onMouseMove directly on canvas

  // Generate heatmap visualization
  useEffect(() => {
    if (!showHeatmap || !canvasRef.current || mouseData.length === 0) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to container size
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = 300 // Fixed height for the heatmap area

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create density map
    const densityMap: number[][] = []
    const gridSize = 8
    const cols = Math.ceil(canvas.width / gridSize)
    const rows = Math.ceil(canvas.height / gridSize)

    // Initialize density map
    for (let i = 0; i < rows; i++) {
      densityMap[i] = new Array(cols).fill(0)
    }

    // Calculate density
    mouseData.forEach((point) => {
      const col = Math.floor(point.x / gridSize)
      const row = Math.floor(point.y / gridSize)
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        densityMap[row][col]++
      }
    })

    // Find max density for normalization
    let maxDensity = 0
    densityMap.forEach((row) => {
      row.forEach((density) => {
        maxDensity = Math.max(maxDensity, density)
      })
    })

    if (maxDensity === 0) return

    // Draw heatmap
    densityMap.forEach((row, rowIndex) => {
      row.forEach((density, colIndex) => {
        if (density > 0) {
          const intensity = density / maxDensity
          const alpha = intensity * config.opacity

          // Create gradient based on intensity
          let color = `rgba(0, 0, 255, ${alpha * 0.3})` // Default blue
          if (intensity > 0.8)
            color = `rgba(255, 0, 0, ${alpha})` // Red
          else if (intensity > 0.6)
            color = `rgba(255, 165, 0, ${alpha})` // Orange
          else if (intensity > 0.4)
            color = `rgba(255, 255, 0, ${alpha})` // Yellow
          else if (intensity > 0.2) color = `rgba(0, 255, 0, ${alpha})` // Green

          ctx.fillStyle = color
          ctx.fillRect(colIndex * gridSize, rowIndex * gridSize, gridSize, gridSize)
        }
      })
    })
  }, [mouseData, showHeatmap, config.opacity])

  // Clear all data
  const clearData = () => {
    setMouseData([])
  }

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(mouseData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mouse-heatmap-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Get activity stats
  const getActivityStats = () => {
    if (mouseData.length === 0) return { totalPoints: 0, recentPoints: 0, activeTime: 0 }

    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    const recentPoints = mouseData.filter((point) => point.timestamp > fiveMinutesAgo)

    return {
      totalPoints: mouseData.length,
      recentPoints: recentPoints.length,
      activeTime: mouseData.length > 0 ? Math.round((now.getTime() - mouseData[0].timestamp.getTime()) / 1000) : 0,
    }
  }

  const stats = getActivityStats()

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Mouse Activity Heatmap</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={config.enabled ? "default" : "secondary"} className="bg-blue-100 text-blue-800">
              {config.enabled ? "Recording" : "Paused"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHeatmap(!showHeatmap)}
              title={showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
            >
              {showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPoints.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.recentPoints}</div>
            <div className="text-xs text-gray-500">Last 5 Min</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{Math.floor(stats.activeTime / 60)}m</div>
            <div className="text-xs text-gray-500">Active Time</div>
          </div>
        </div>

        {/* Heatmap Visualization Area */}
        {showHeatmap && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">HEATMAP VISUALIZATION</h4>
            <div
              ref={containerRef}
              className="relative border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
              style={{ height: "300px" }}
            >
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                style={{ background: "transparent" }}
                onMouseMove={handleMouseMove}
              />
              <div className="absolute top-2 left-2 text-xs text-gray-400 pointer-events-none">
                Move your mouse over this area to generate heatmap data
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Tracking</label>
            <Switch checked={config.enabled} onCheckedChange={(enabled) => setConfig({ ...config, enabled })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Opacity: {Math.round(config.opacity * 100)}%</label>
            <Slider
              value={[config.opacity]}
              onValueChange={([opacity]) => setConfig({ ...config, opacity })}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Points: {config.maxPoints.toLocaleString()}</label>
            <Slider
              value={[config.maxPoints]}
              onValueChange={([maxPoints]) => setConfig({ ...config, maxPoints })}
              max={10000}
              min={1000}
              step={500}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearData}
            className="flex items-center space-x-1 bg-transparent"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="flex items-center space-x-1 bg-transparent"
          >
            <Download className="h-3 w-3" />
            <span>Export</span>
          </Button>
          <Button
            variant={showHeatmap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center space-x-1"
          >
            {showHeatmap ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            <span>{showHeatmap ? "Hide" : "Show"}</span>
          </Button>
        </div>

        {/* Recent Activity Preview */}
        {mouseData.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-500 mb-2">RECENT COORDINATES</h4>
            <div className="bg-gray-50 rounded p-2 text-xs font-mono max-h-32 overflow-y-auto">
              {mouseData.slice(-10).map((point, index) => (
                <div key={index} className="text-gray-600">
                  ({Math.round(point.x)}, {Math.round(point.y)}) - {point.timestamp.toLocaleTimeString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
