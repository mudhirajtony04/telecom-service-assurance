"use client"

import { Clock, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Assurance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time network monitoring and compliance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="last-24h">
            <SelectTrigger className="w-40">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-1h">Last 1 hour</SelectItem>
              <SelectItem value="last-24h">Last 24 hours</SelectItem>
              <SelectItem value="last-7d">Last 7 days</SelectItem>
              <SelectItem value="last-30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Settings2 className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
    </header>
  )
}
