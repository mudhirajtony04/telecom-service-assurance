"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComplianceItem {
  id: string
  name: string
  status: "compliant" | "warning" | "critical"
  lastCheck: string
  sla: string
  threshold: string
  trend: number
  current: string
}

export function CompliancePage() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      name: "Latency SLA (< 50ms)",
      status: "compliant",
      lastCheck: "2 minutes ago",
      sla: "99.9%",
      threshold: "< 50ms",
      trend: -2,
      current: "12.5ms",
    },
    {
      id: "2",
      name: "Packet Loss (< 0.1%)",
      status: "compliant",
      lastCheck: "2 minutes ago",
      sla: "99.95%",
      threshold: "< 0.1%",
      trend: 0,
      current: "0.02%",
    },
    {
      id: "3",
      name: "Availability SLA (> 99%)",
      status: "compliant",
      lastCheck: "2 minutes ago",
      sla: "99.8%",
      threshold: "> 99%",
      trend: 1,
      current: "99.8%",
    },
    {
      id: "4",
      name: "QoS Score (> 90)",
      status: "warning",
      lastCheck: "2 minutes ago",
      sla: "88.5%",
      threshold: "> 90",
      trend: -3,
      current: "88.5",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setComplianceItems((prev) =>
        prev.map((item) => ({
          ...item,
          lastCheck: "just now",
          trend: Math.floor(Math.random() * 5) - 2,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-500/10 border-green-500/20"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20"
      case "critical":
        return "bg-red-500/10 border-red-500/20"
      default:
        return "bg-card border-border"
    }
  }

  const complianceHistoryData = [
    { time: "00:00", compliance: 98.2 },
    { time: "04:00", compliance: 98.5 },
    { time: "08:00", compliance: 98.8 },
    { time: "12:00", compliance: 99.1 },
    { time: "16:00", compliance: 99.0 },
    { time: "20:00", compliance: 98.9 },
    { time: "24:00", compliance: 99.2 },
  ]

  const compliantCount = complianceItems.filter((item) => item.status === "compliant").length
  const compliancePercentage = Math.round((compliantCount / complianceItems.length) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Compliance Management</h2>
        <p className="text-muted-foreground mt-1">Service Level Agreement monitoring and compliance tracking</p>
      </div>

      {/* Compliance Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{compliancePercentage}%</p>
              <p className="text-sm text-muted-foreground mt-1">Overall Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{complianceItems.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total SLAs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{compliantCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">{complianceItems.length - compliantCount}</p>
              <p className="text-sm text-muted-foreground mt-1">At Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Details and History */}
      <Tabs defaultValue="slas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="slas">Service Level Agreements</TabsTrigger>
          <TabsTrigger value="history">Compliance History</TabsTrigger>
        </TabsList>

        <TabsContent value="slas" className="space-y-4 mt-4">
          {complianceItems.map((item) => (
            <Card key={item.id} className={`border-2 ${getStatusColor(item.status)}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          Current: <span className="font-mono text-foreground">{item.current}</span>
                        </span>
                        <span>
                          Threshold: <span className="font-mono">{item.threshold}</span>
                        </span>
                        <span>Last check: {item.lastCheck}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                      <span className={item.trend > 0 ? "text-red-500" : "text-green-500"}>
                        {Math.abs(item.trend)}%
                      </span>
                    </div>
                    <p className="text-lg font-bold text-primary min-w-fit">{item.sla}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trend (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[97, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="compliance"
                    stroke="hsl(var(--chart-2))"
                    dot={false}
                    strokeWidth={2}
                    name="Compliance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
