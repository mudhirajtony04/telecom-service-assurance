"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, Server, Radio } from "lucide-react"

export function NetworkTopology() {
  const components = [
    { name: "Core Network", icon: Server, status: "online" as const, color: "primary" },
    { name: "Distribution", icon: Radio, status: "online" as const, color: "accent" },
    { name: "Access Points", icon: Wifi, status: "online" as const, color: "chart-3" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Topology Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between px-8 py-6">
          {components.map((component, index) => (
            <div key={component.name}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-4 bg-${component.color}/20 border border-${component.color} rounded-lg transition-all duration-300`}
                >
                  <component.icon className={`h-8 w-8 text-${component.color}`} />
                </div>
                <p className="text-sm font-medium">{component.name}</p>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              {index < components.length - 1 && (
                <div className="flex-1 h-1 bg-gradient-to-r from-accent to-primary mx-4 w-32"></div>
              )}
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">99.8%</p>
            <p className="text-sm text-muted-foreground mt-1">Availability</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">4.2ms</p>
            <p className="text-sm text-muted-foreground mt-1">Avg Latency</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-2">12</p>
            <p className="text-sm text-muted-foreground mt-1">Active Links</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-4">847GB</p>
            <p className="text-sm text-muted-foreground mt-1">Data Processed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
