"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function Page() {
  const data = [
    { interface: "eth0", inbound: 450, outbound: 320, errors: 5 },
    { interface: "eth1", inbound: 380, outbound: 410, errors: 2 },
    { interface: "eth2", inbound: 520, outbound: 290, errors: 1 },
    { interface: "eth3", inbound: 400, outbound: 360, errors: 3 },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background p-8">
      <h2 className="text-2xl font-bold mb-6">Interface Metrics</h2>
      <Card>
        <CardHeader>
          <CardTitle>Bandwidth by Interface (Mbps)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="interface" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="inbound" fill="hsl(var(--chart-1))" name="Inbound" />
              <Bar dataKey="outbound" fill="hsl(var(--chart-2))" name="Outbound" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
