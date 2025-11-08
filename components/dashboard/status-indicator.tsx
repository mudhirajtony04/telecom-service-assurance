"use client"

import { Circle } from "lucide-react"

interface StatusIndicatorProps {
  status: "compliant" | "warning" | "critical"
  lastUpdate: Date
}

export function StatusIndicator({ status, lastUpdate }: StatusIndicatorProps) {
  const statusConfig = {
    compliant: {
      label: "System Healthy",
      color: "bg-green-500",
      dot: "bg-green-500",
    },
    warning: {
      label: "Warning",
      color: "bg-yellow-500",
      dot: "bg-yellow-500",
    },
    critical: {
      label: "Critical",
      color: "bg-red-500",
      dot: "bg-red-500",
    },
  }

  const config = statusConfig[status]
  const timeAgo = new Date().getTime() - lastUpdate.getTime()
  const seconds = Math.floor(timeAgo / 1000)

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border">
      <div className="relative">
        <Circle className={`h-4 w-4 ${config.dot}`} fill="currentColor" />
        <Circle
          className={`h-4 w-4 ${config.dot} absolute top-0 left-0 animate-pulse`}
          fill="currentColor"
          opacity={0.5}
        />
      </div>
      <div className="text-sm">
        <p className="font-medium text-foreground">{config.label}</p>
        <p className="text-xs text-muted-foreground">Updated {seconds}s ago</p>
      </div>
    </div>
  )
}
