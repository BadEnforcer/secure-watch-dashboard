"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { TimeSeriesData } from "@/lib/chart-utils"

interface ThreatLevelChartProps {
  data: TimeSeriesData[]
}

const chartConfig = {
  DEBUG: {
    label: "Debug",
    color: "#6b7280", // Gray
  },
  INFO: {
    label: "Info",
    color: "#3b82f6", // Blue
  },
  WARNING: {
    label: "Warning",
    color: "#f59e0b", // Amber/Yellow
  },
  ERROR: {
    label: "Error",
    color: "#ef4444", // Red
  },
  CRITICAL: {
    label: "Critical",
    color: "#dc2626", // Dark Red
  },
}

export function ThreatLevelChart({ data }: ThreatLevelChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Threat Levels Over Time</CardTitle>
        <CardDescription>Security events by severity level across 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="DEBUG" stackId="a" fill={chartConfig.DEBUG.color} />
              <Bar dataKey="INFO" stackId="a" fill={chartConfig.INFO.color} />
              <Bar dataKey="WARNING" stackId="a" fill={chartConfig.WARNING.color} />
              <Bar dataKey="ERROR" stackId="a" fill={chartConfig.ERROR.color} />
              <Bar dataKey="CRITICAL" stackId="a" fill={chartConfig.CRITICAL.color} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
