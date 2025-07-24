"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { FilterOptions, LogLevel, ThreatCategory } from "@/types/log"

interface LogFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
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

export function LogFilters({ filters, onFiltersChange }: LogFiltersProps) {
  const allLevels: LogLevel[] = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
  const allCategories: ThreatCategory[] = [
    "Authentication",
    "Network Security",
    "Malware Detection",
    "System Events",
    "Access Control",
  ]

  const toggleLevel = (level: LogLevel) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level]
    onFiltersChange({ ...filters, levels: newLevels })
  }

  const toggleCategory = (category: ThreatCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const clearFilters = () => {
    onFiltersChange({
      levels: allLevels,
      categories: allCategories,
      timeRange: "24h",
      searchQuery: "",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">LOG LEVELS</h4>
          <div className="flex flex-wrap gap-1">
            {allLevels.map((level) => (
              <Badge
                key={level}
                variant={filters.levels.includes(level) ? "default" : "outline"}
                className={`cursor-pointer text-xs border ${
                  filters.levels.includes(level) ? levelColors[level] : "hover:bg-gray-50"
                }`}
                onClick={() => toggleLevel(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">CATEGORIES</h4>
          <div className="flex flex-wrap gap-1">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer text-xs border ${
                  filters.categories.includes(category) ? categoryColors[category] : "hover:bg-gray-50"
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
