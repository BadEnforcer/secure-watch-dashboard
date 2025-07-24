"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { LogFilters } from "@/components/log-filters"
import { LogTable } from "@/components/log-table"
import { ThreatLevelChart } from "@/components/threat-level-chart"
import { CategoryBarChart, CategoryLineChart } from "@/components/category-charts"
import { generateLogEntry, generateStaticData } from "@/lib/log-generator"
import { aggregateLogsByHour, aggregateCategoriesByHour } from "@/lib/chart-utils"
import type { LogEntry, LogStats, FilterOptions, LogLevel, ThreatCategory } from "@/types/log"
import { PortScannerStats } from "@/components/port-scanner-stats"
import { PortScannerTable } from "@/components/port-scanner-table"
import { PortScannerControls } from "@/components/port-scanner-controls"
import { MouseHeatmap } from "@/components/mouse-heatmap"
import type { PortResult, ScanSession, PortScanStats } from "@/types/port-scanner"

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    levels: ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
    categories: ["Authentication", "Network Security", "Malware Detection", "System Events", "Access Control"],
    timeRange: "24h",
    searchQuery: "",
  })

  const [portResults, setPortResults] = useState<PortResult[]>([])
  const [activeSessions, setActiveSessions] = useState<ScanSession[]>([])
  const [isScanning, setIsScanning] = useState(false)

  // Generate initial logs with 24 hours of static data
  useEffect(() => {
    const staticLogs = generateStaticData()
    setLogs(staticLogs)
  }, [])

  // Generate new logs periodically
  useEffect(() => {
    const interval = setInterval(
      () => {
        const newLog = generateLogEntry()
        setLogs((prev) => [newLog, ...prev].slice(0, 1000)) // Keep only last 1000 logs
      },
      Math.random() * 3000 + 1000,
    ) // Random interval between 1-4 seconds

    return () => clearInterval(interval)
  }, [])

  // Real port scanning function
  const startPortScan = async (targetIp: string, startPort: number, endPort: number) => {
    setIsScanning(true)

    // Create new scan session
    const newSession: ScanSession = {
      id: crypto.randomUUID(),
      targetIp,
      startPort,
      endPort,
      startTime: new Date(),
      status: "running",
      progress: 0,
      totalPorts: endPort - startPort + 1,
      scannedPorts: 0,
    }

    setActiveSessions((prev) => [newSession, ...prev])

    try {
      const response = await fetch("/api/port-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetIp,
          startPort,
          endPort,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add results to port results
        const newResults: PortResult[] = data.results.map((result: any) => ({
          ...result,
          timestamp: new Date(result.timestamp),
        }))

        setPortResults((prev) => [...newResults, ...prev].slice(0, 200))

        // Update session as completed
        setActiveSessions((prev) =>
          prev.map((session) =>
            session.id === newSession.id
              ? {
                  ...session,
                  status: "completed",
                  progress: 100,
                  endTime: new Date(),
                  scannedPorts: session.totalPorts,
                }
              : session,
          ),
        )
      } else {
        console.error("Port scan failed:", data.error)
        // Update session as error
        setActiveSessions((prev) =>
          prev.map((session) =>
            session.id === newSession.id ? { ...session, status: "error", endTime: new Date() } : session,
          ),
        )
      }
    } catch (error) {
      console.error("Port scan request failed:", error)
      // Update session as error
      setActiveSessions((prev) =>
        prev.map((session) =>
          session.id === newSession.id ? { ...session, status: "error", endTime: new Date() } : session,
        ),
      )
    } finally {
      setIsScanning(false)
    }
  }

  // Filter logs based on current filters and search query
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = filters.levels.includes(log.level)
      const matchesCategory = filters.categories.includes(log.category)
      const matchesSearch =
        searchQuery === "" ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesLevel && matchesCategory && matchesSearch
    })
  }, [logs, filters, searchQuery])

  // Calculate statistics
  const stats: LogStats = useMemo(() => {
    const byLevel: Record<LogLevel, number> = {
      DEBUG: 0,
      INFO: 0,
      WARNING: 0,
      ERROR: 0,
      CRITICAL: 0,
    }
    const byCategory: Record<ThreatCategory, number> = {
      Authentication: 0,
      "Network Security": 0,
      "Malware Detection": 0,
      "System Events": 0,
      "Access Control": 0,
    }

    filteredLogs.forEach((log) => {
      byLevel[log.level]++
      byCategory[log.category]++
    })

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentThreats = filteredLogs.filter(
      (log) => log.timestamp > oneHourAgo && (log.level === "ERROR" || log.level === "CRITICAL"),
    ).length

    return {
      total: filteredLogs.length,
      byLevel,
      byCategory,
      recentThreats,
    }
  }, [filteredLogs])

  // Calculate port scanner statistics
  const portScannerStats: PortScanStats = useMemo(() => {
    const openPorts = portResults.filter((r) => r.status === "open").length
    const closedPorts = portResults.filter((r) => r.status === "closed").length
    const filteredPorts = portResults.filter((r) => r.status === "filtered").length

    const commonServices: Record<string, number> = {}
    portResults.forEach((result) => {
      if (result.service) {
        commonServices[result.service] = (commonServices[result.service] || 0) + 1
      }
    })

    return {
      totalScans: activeSessions.filter((s) => s.status === "completed").length,
      activeSessions: activeSessions.filter((s) => s.status === "running").length,
      openPorts,
      closedPorts,
      filteredPorts,
      commonServices,
      recentScans: activeSessions.slice(0, 5),
    }
  }, [portResults, activeSessions])

  // Prepare chart data
  const chartData = useMemo(() => {
    const hourlyLevels = aggregateLogsByHour(logs)
    const hourlyCategories = aggregateCategoriesByHour(logs)
    return { hourlyLevels, hourlyCategories }
  }, [logs])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="p-6">
        <div className="w-full max-w-none mx-auto space-y-6">
          <StatsCards stats={stats} />

          {/* Charts Section - Full Width */}
          <div className="w-full space-y-6">
            <ThreatLevelChart data={chartData.hourlyLevels} />
            <CategoryBarChart data={chartData.hourlyCategories} />
            <CategoryLineChart data={chartData.hourlyCategories} />
          </div>

          {/* Port Scanner Section */}
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Port Scanner</h2>
              <PortScannerStats stats={portScannerStats} />
            </div>

            <PortScannerControls onStartScan={startPortScan} isScanning={isScanning} />
            <PortScannerTable portResults={portResults} activeSessions={activeSessions} />
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 space-y-6">
              <LogFilters filters={filters} onFiltersChange={setFilters} />
              <MouseHeatmap />
            </div>

            <div className="lg:col-span-3">
              <LogTable logs={filteredLogs.slice(0, 100)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
