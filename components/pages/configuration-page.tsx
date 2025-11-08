"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Check, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SNMPConfig {
  id: string
  host: string
  community: string
  port: number
  status: "active" | "inactive" | "error"
  lastPolled: string
  version: string
}

interface OIDMapping {
  id: string
  oid: string
  name: string
  description: string
  type: "gauge" | "counter" | "string"
  enabled: boolean
}

interface Threshold {
  id: string
  metric: string
  warning: number
  critical: number
  enabled: boolean
}

export function ConfigurationPage() {
  const [collectors, setCollectors] = useState<SNMPConfig[]>([
    {
      id: "1",
      host: "192.168.1.1",
      community: "public",
      port: 161,
      status: "active",
      lastPolled: "2 seconds ago",
      version: "v2c",
    },
    {
      id: "2",
      host: "192.168.1.2",
      community: "public",
      port: 161,
      status: "active",
      lastPolled: "5 seconds ago",
      version: "v2c",
    },
  ])

  const [oids, setOids] = useState<OIDMapping[]>([
    {
      id: "1",
      oid: "1.3.6.1.2.1.1.3.0",
      name: "sysUpTime",
      description: "System uptime in ticks",
      type: "counter",
      enabled: true,
    },
    {
      id: "2",
      oid: "1.3.6.1.2.1.25.3.2.1.5.1",
      name: "cpuUsage",
      description: "CPU usage percentage",
      type: "gauge",
      enabled: true,
    },
    {
      id: "3",
      oid: "1.3.6.1.2.1.25.2.3.1.5",
      name: "memoryUsage",
      description: "Memory usage in bytes",
      type: "gauge",
      enabled: true,
    },
  ])

  const [thresholds, setThresholds] = useState<Threshold[]>([
    {
      id: "1",
      metric: "Latency",
      warning: 50,
      critical: 100,
      enabled: true,
    },
    {
      id: "2",
      metric: "Packet Loss",
      warning: 0.5,
      critical: 1.0,
      enabled: true,
    },
    {
      id: "3",
      metric: "Bandwidth Utilization",
      warning: 80,
      critical: 95,
      enabled: true,
    },
  ])

  const [newCollector, setNewCollector] = useState({
    host: "",
    community: "public",
    port: 161,
    version: "v2c",
  })

  const [editingCollector, setEditingCollector] = useState<string | null>(null)

  const handleAddCollector = () => {
    if (newCollector.host) {
      setCollectors([
        ...collectors,
        {
          id: String(Date.now()),
          ...newCollector,
          status: "active",
          lastPolled: "just now",
        },
      ])
      setNewCollector({ host: "", community: "public", port: 161, version: "v2c" })
    }
  }

  const handleRemoveCollector = (id: string) => {
    setCollectors(collectors.filter((c) => c.id !== id))
  }

  const handleToggleOID = (id: string) => {
    setOids(oids.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o)))
  }

  const handleToggleThreshold = (id: string) => {
    setThresholds(thresholds.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
  }

  const handleRemoveThreshold = (id: string) => {
    setThresholds(thresholds.filter((t) => t.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "inactive":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500"
      case "inactive":
        return "bg-gray-500/20 text-gray-500"
      case "error":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Configuration Management</h2>
        <p className="text-muted-foreground mt-1">Configure SNMP collectors, OID mappings, and monitoring thresholds</p>
      </div>

      <Tabs defaultValue="collectors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collectors">SNMP Collectors</TabsTrigger>
          <TabsTrigger value="oids">OID Mappings</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
        </TabsList>

        {/* SNMP Collectors Tab */}
        <TabsContent value="collectors" className="space-y-4 mt-4">
          {/* Add New Collector */}
          <Card>
            <CardHeader>
              <CardTitle>Add SNMP Collector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end flex-wrap">
                <div className="flex-1 min-w-48">
                  <label className="text-sm font-medium">Host IP</label>
                  <Input
                    placeholder="192.168.1.x"
                    value={newCollector.host}
                    onChange={(e) => setNewCollector({ ...newCollector, host: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1 min-w-48">
                  <label className="text-sm font-medium">Community String</label>
                  <Input
                    placeholder="public"
                    value={newCollector.community}
                    onChange={(e) => setNewCollector({ ...newCollector, community: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="w-32">
                  <label className="text-sm font-medium">Port</label>
                  <Input
                    type="number"
                    placeholder="161"
                    value={newCollector.port}
                    onChange={(e) => setNewCollector({ ...newCollector, port: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div className="w-32">
                  <label className="text-sm font-medium">SNMP Version</label>
                  <select
                    value={newCollector.version}
                    onChange={(e) => setNewCollector({ ...newCollector, version: e.target.value })}
                    className="w-full px-3 py-1 rounded-md border border-input bg-background text-foreground text-sm mt-1"
                  >
                    <option value="v2c">v2c</option>
                    <option value="v3">v3</option>
                  </select>
                </div>
                <Button onClick={handleAddCollector} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Collector
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Collectors List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Collectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collectors.map((collector) => (
                  <div
                    key={collector.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(collector.status)}
                      <div>
                        <p className="font-medium">
                          {collector.host}:{collector.port}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Community: {collector.community} • Version: {collector.version} • Last polled:{" "}
                          {collector.lastPolled}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(collector.status)}>{collector.status.toUpperCase()}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveCollector(collector.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OID Mappings Tab */}
        <TabsContent value="oids" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SNMP OID Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {oids.map((oid) => (
                  <div
                    key={oid.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono text-sm">{oid.oid}</p>
                        <Badge variant="outline">{oid.type}</Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground mt-1">{oid.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{oid.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleOID(oid.id)}
                        className={oid.enabled ? "text-green-500" : "text-gray-500"}
                      >
                        {oid.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Thresholds Tab */}
        <TabsContent value="thresholds" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {thresholds.map((threshold) => (
                  <div
                    key={threshold.id}
                    className={`p-4 border rounded-lg transition-all ${
                      threshold.enabled
                        ? "border-border bg-card/50 hover:bg-card"
                        : "border-border/50 bg-card/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{threshold.metric}</p>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Warning: <span className="font-mono text-yellow-500">{threshold.warning}</span>
                          </span>
                          <span>
                            Critical: <span className="font-mono text-red-500">{threshold.critical}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleThreshold(threshold.id)}
                          className={threshold.enabled ? "text-green-500" : "text-gray-500"}
                        >
                          {threshold.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveThreshold(threshold.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Threshold */}
          <Card>
            <CardHeader>
              <CardTitle>Add Alert Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Use the threshold settings above to configure alert levels for different metrics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
