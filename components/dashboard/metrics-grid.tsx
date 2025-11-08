"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricsGridProps {
  metrics: {
    latency: number
    packetLoss: number
    qosScore: number
    bandwidth: number
  }
}

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: number
  status?: "good" | "warning" | "critical"
}

function MetricCard({ title, value, unit, trend, status = "good" }: MetricCardProps) {
  const statusColors = {
    good: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-red-500",
  }

  return (
    <Card className="bg-card border-border transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-3xl font-bold ${statusColors[status]} transition-colors duration-300`}>
              {typeof value === "number" ? value.toFixed(2) : value}
              {unit && <span className="text-lg ml-1">{unit}</span>}
            </p>
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 transition-colors duration-300 ${trend > 0 ? "text-red-500" : "text-green-500"}`}
            >
              {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="Network Latency"
        value={metrics.latency}
        unit="ms"
        trend={-2}
        status={metrics.latency < 20 ? "good" : metrics.latency < 40 ? "warning" : "critical"}
      />
      <MetricCard
        title="Packet Loss"
        value={(metrics.packetLoss * 100).toFixed(3)}
        unit="%"
        trend={0}
        status={metrics.packetLoss < 0.05 ? "good" : metrics.packetLoss < 0.08 ? "warning" : "critical"}
      />
      <MetricCard
        title="QoS Score"
        value={metrics.qosScore}
        unit="/100"
        trend={1}
        status={metrics.qosScore > 90 ? "good" : metrics.qosScore > 80 ? "warning" : "critical"}
      />
      <MetricCard
        title="Bandwidth Utilization"
        value={metrics.bandwidth}
        unit="%"
        trend={3}
        status={metrics.bandwidth < 70 ? "good" : metrics.bandwidth < 85 ? "warning" : "critical"}
      />
    </div>
  )
}
