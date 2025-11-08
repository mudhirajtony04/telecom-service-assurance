"use client"

import { useState, useEffect } from "react"
import { ComplianceOverview } from "@/components/dashboard/compliance-overview"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { NetworkTopology } from "@/components/dashboard/network-topology"
import { StatusIndicator } from "@/components/dashboard/status-indicator"

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState({
    latency: 12.5,
    packetLoss: 0.02,
    qosScore: 94,
    bandwidth: 78,
    complianceStatus: "compliant" as const,
    lastUpdate: new Date(),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        latency: Math.max(5, Math.min(50, prev.latency + (Math.random() - 0.5) * 4)),
        packetLoss: Math.max(0, Math.min(0.1, prev.packetLoss + (Math.random() - 0.5) * 0.01)),
        qosScore: Math.max(80, Math.min(100, prev.qosScore + (Math.random() - 0.5) * 2)),
        bandwidth: Math.max(40, Math.min(95, prev.bandwidth + (Math.random() - 0.5) * 3)),
        complianceStatus: Math.random() > 0.95 ? "warning" : "compliant",
        lastUpdate: new Date(),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 space-y-8">
      {/* System Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Network Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time service health and performance tracking</p>
        </div>
        <StatusIndicator status={metrics.complianceStatus} lastUpdate={metrics.lastUpdate} />
      </div>

      {/* Compliance Status */}
      <ComplianceOverview status={metrics.complianceStatus} />

      {/* Key Metrics Grid */}
      <MetricsGrid metrics={metrics} />

      {/* Performance and Alerts */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Network Topology */}
      <NetworkTopology />
    </div>
  )
}
