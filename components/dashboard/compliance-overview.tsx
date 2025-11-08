"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ComplianceOverviewProps {
  status: "compliant" | "warning" | "critical"
}

export function ComplianceOverview({ status }: ComplianceOverviewProps) {
  const [compliance, setCompliance] = useState(98.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCompliance((prev) => {
        const change = (Math.random() - 0.5) * 0.5
        return Math.max(85, Math.min(99.9, prev + change))
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const statusConfig = {
    compliant: {
      icon: CheckCircle2,
      label: "Compliant",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      progressColor: "bg-green-500",
    },
    warning: {
      icon: AlertTriangle,
      label: "Warning",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      progressColor: "bg-yellow-500",
    },
    critical: {
      icon: AlertTriangle,
      label: "Critical",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      progressColor: "bg-red-500",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor}`}>
      <CardHeader>
        <CardTitle className="text-lg">Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Icon className={`h-12 w-12 ${config.color}`} />
            <div>
              <p className={`text-3xl font-bold ${config.color}`}>{config.label}</p>
              <p className="text-sm text-muted-foreground mt-1">All service level agreements on track</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Overall Compliance Rate</p>
              <p className="text-sm font-bold text-foreground">{compliance.toFixed(1)}%</p>
            </div>
            <Progress value={compliance} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
