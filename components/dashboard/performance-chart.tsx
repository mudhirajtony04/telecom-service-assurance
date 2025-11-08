"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function PerformanceChart() {
  const data = [
    { time: "00:00", latency: 15, packetLoss: 0.01, qosScore: 92 },
    { time: "02:00", latency: 18, packetLoss: 0.02, qosScore: 91 },
    { time: "04:00", latency: 22, packetLoss: 0.03, qosScore: 89 },
    { time: "06:00", latency: 25, packetLoss: 0.04, qosScore: 87 },
    { time: "08:00", latency: 20, packetLoss: 0.02, qosScore: 90 },
    { time: "10:00", latency: 15, packetLoss: 0.01, qosScore: 93 },
    { time: "12:00", latency: 12, packetLoss: 0.01, qosScore: 94 },
    { time: "14:00", latency: 14, packetLoss: 0.02, qosScore: 93 },
    { time: "16:00", latency: 16, packetLoss: 0.02, qosScore: 92 },
    { time: "18:00", latency: 18, packetLoss: 0.03, qosScore: 91 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="hsl(var(--chart-1))"
              dot={false}
              strokeWidth={2}
              name="Latency (ms)"
            />
            <Line
              type="monotone"
              dataKey="qosScore"
              stroke="hsl(var(--chart-2))"
              dot={false}
              strokeWidth={2}
              name="QoS Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
