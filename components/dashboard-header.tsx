"use client"

import { Shield, Bell, Settings, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DashboardHeader({ searchQuery, onSearchChange }: DashboardHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-xl font-semibold text-gray-900">SecureWatch</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <a href="#" className="text-sm font-medium text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Threats
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Analytics
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Reports
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
