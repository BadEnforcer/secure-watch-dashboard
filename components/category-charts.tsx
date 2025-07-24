"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { CategoryTimeData } from "@/lib/chart-utils"

interface CategoryChartsProps {
  data: CategoryTimeData[]
}

const categoryConfig = {
  Authentication: {
    label: "Authentication",
    color: "#8b5cf6", // Purple
  },
  "Network Security": {
    label: "Network Security",
    color: "#10b981", // Emerald/Green
  },
  "Malware Detection": {
    label: "Malware Detection",
    color: "#ef4444", // Red
  },
  "System Events": {
    label: "System Events",
    color: "#3b82f6", // Blue
  },
  "Access Control": {
    label: "Access Control",
    color: "#f59e0b", // Amber/Orange
  },
}

export function CategoryBarChart({ data }: CategoryChartsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Threat Categories Distribution</CardTitle>
        <CardDescription>Security events by category across 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={categoryConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="Authentication" fill={categoryConfig.Authentication.color} />
              <Bar dataKey="Network Security" fill={categoryConfig["Network Security"].color} />
              <Bar dataKey="Malware Detection" fill={categoryConfig["Malware Detection"].color} />
              <Bar dataKey="System Events" fill={categoryConfig["System Events"].color} />
              <Bar dataKey="Access Control" fill={categoryConfig["Access Control"].color} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function CategoryLineChart({ data }: CategoryChartsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Threat Category Trends</CardTitle>
        <CardDescription>Trend analysis of security events by category</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={categoryConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Authentication"
                stroke={categoryConfig.Authentication.color}
                strokeWidth={3}
                dot={{ r: 4, fill: categoryConfig.Authentication.color }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Network Security"
                stroke={categoryConfig["Network Security"].color}
                strokeWidth={3}
                dot={{ r: 4, fill: categoryConfig["Network Security"].color }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Malware Detection"
                stroke={categoryConfig["Malware Detection"].color}
                strokeWidth={3}
                dot={{ r: 4, fill: categoryConfig["Malware Detection"].color }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="System Events"
                stroke={categoryConfig["System Events"].color}
                strokeWidth={3}
                dot={{ r: 4, fill: categoryConfig["System Events"].color }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Access Control"
                stroke={categoryConfig["Access Control"].color}
                strokeWidth={3}
                dot={{ r: 4, fill: categoryConfig["Access Control"].color }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
