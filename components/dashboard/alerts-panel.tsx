"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Zap, Wifi, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Alert {
  id: string
  type: "error" | "warning" | "info"
  title: string
  description: string
  timestamp: string
  acknowledged: boolean
  source: string
}

type AlertFilter = "all" | "error" | "warning" | "info"

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "error",
      title: "High Latency Detected",
      description: "Link-1 experiencing 250ms latency",
      timestamp: "2 minutes ago",
      acknowledged: false,
      source: "network-monitor",
    },
    {
      id: "2",
      type: "warning",
      title: "Bandwidth Alert",
      description: "Interface eth0 at 92% utilization",
      timestamp: "5 minutes ago",
      acknowledged: false,
      source: "bandwidth-monitor",
    },
    {
      id: "3",
      type: "info",
      title: "Configuration Updated",
      description: "SNMP threshold modified for QoS",
      timestamp: "1 hour ago",
      acknowledged: true,
      source: "system",
    },
  ])

  const [filter, setFilter] = useState<AlertFilter>("all")

  useEffect(() => {
    const alertTimer = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert: Alert = {
          id: String(Date.now()),
          type: ["error", "warning", "info"][Math.floor(Math.random() * 3)] as Alert["type"],
          title: ["High Latency Detected", "Bandwidth Alert", "Packet Loss Alert", "QoS Degradation"][
            Math.floor(Math.random() * 4)
          ],
          description: ["Link experiencing issues", "Interface at high utilization", "Threshold exceeded"][
            Math.floor(Math.random() * 3)
          ],
          timestamp: "just now",
          acknowledged: false,
          source: ["network-monitor", "bandwidth-monitor", "qos-monitor"][Math.floor(Math.random() * 3)],
        }
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(alertTimer)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <Zap className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Wifi className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500/20 text-red-500"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500"
      case "info":
        return "bg-blue-500/20 text-blue-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredAlerts = alerts.filter((alert) => (filter === "all" ? true : alert.type === filter))

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const unreadCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            {unreadCount > 0 && <Badge className="bg-red-500/20 text-red-500">{unreadCount} new</Badge>}
          </div>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "error" ? "default" : "outline"} size="sm" onClick={() => setFilter("error")}>
              Errors
            </Button>
            <Button
              variant={filter === "warning" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("warning")}
            >
              Warnings
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3 pr-4">
            {filteredAlerts.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">No {filter !== "all" ? filter : ""} alerts</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-3 transition-all duration-200 ${
                    alert.acknowledged
                      ? "bg-card/30 border-border/50 opacity-60"
                      : "bg-card/80 border-border hover:border-primary/50 hover:bg-card"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{alert.title}</p>
                        <Badge className={`text-xs ${getAlertBadgeColor(alert.type)}`}>{alert.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground/50">{alert.timestamp}</p>
                        <div className="flex gap-1">
                          {!alert.acknowledged && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              Ack
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-6" onClick={() => handleDismiss(alert.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
