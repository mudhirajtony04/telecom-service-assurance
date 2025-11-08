"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react"

interface MetricTrend {
  label: string
  value: string
  change: number
  trend: "up" | "down"
}

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  // Performance trend data
  const performanceTrendData = [
    { time: "Mon", latency: 15, packetLoss: 0.02, qosScore: 92 },
    { time: "Tue", latency: 18, packetLoss: 0.025, qosScore: 91 },
    { time: "Wed", latency: 12, packetLoss: 0.015, qosScore: 94 },
    { time: "Thu", latency: 20, packetLoss: 0.03, qosScore: 89 },
    { time: "Fri", latency: 14, packetLoss: 0.02, qosScore: 93 },
    { time: "Sat", latency: 10, packetLoss: 0.01, qosScore: 95 },
    { time: "Sun", latency: 11, packetLoss: 0.012, qosScore: 94 },
  ]

  // Traffic distribution
  const trafficData = [
    { name: "Peak Hours", value: 35 },
    { name: "Normal Hours", value: 45 },
    { name: "Off-Peak", value: 20 },
  ]

  // QoS distribution
  const qosDistribution = [
    { name: "Excellent (>95)", value: 45 },
    { name: "Good (85-95)", value: 35 },
    { name: "Fair (70-85)", value: 15 },
    { name: "Poor (<70)", value: 5 },
  ]

  // Alert trends
  const alertTrendData = [
    { week: "Week 1", errors: 25, warnings: 15, info: 8 },
    { week: "Week 2", errors: 20, warnings: 12, info: 6 },
    { week: "Week 3", errors: 15, warnings: 10, info: 5 },
    { week: "Week 4", errors: 10, warnings: 8, info: 4 },
  ]

  // Bandwidth utilization
  const bandwidthData = [
    { time: "00:00", utilization: 35 },
    { time: "06:00", utilization: 28 },
    { time: "12:00", utilization: 72 },
    { time: "18:00", utilization: 85 },
    { time: "24:00", utilization: 45 },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  const metrics: MetricTrend[] = [
    {
      label: "Avg Latency",
      value: "14.3ms",
      change: -8,
      trend: "down",
    },
    {
      label: "Packet Loss",
      value: "0.019%",
      change: -12,
      trend: "down",
    },
    {
      label: "Availability",
      value: "99.82%",
      change: 2,
      trend: "up",
    },
    {
      label: "QoS Score",
      value: "92.3",
      change: 5,
      trend: "up",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Historical Analytics</h2>
        <p className="text-muted-foreground mt-1">Network performance trends and historical insights</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {metric.trend === "down" ? (
                  <ArrowDown className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                )}
                <span className="text-xs text-green-500">{Math.abs(metric.change)}% from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Alert Trends</TabsTrigger>
          <TabsTrigger value="qos">QoS Distribution</TabsTrigger>
        </TabsList>

        {/* Performance Trends Tab */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" yAxisId="left" />
                  <YAxis stroke="hsl(var(--muted-foreground))" yAxisId="right" orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="latency"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    name="Latency (ms)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="qosScore"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="QoS Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bandwidth Utilization Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bandwidthData}>
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
                  <Bar dataKey="utilization" fill="hsl(var(--chart-3))" name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Analysis Tab */}
        <TabsContent value="traffic" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-chart-1 pl-4">
                  <p className="font-medium">Peak Hours (6PM - 8PM)</p>
                  <p className="text-sm text-muted-foreground">Average bandwidth: 85% utilization</p>
                </div>
                <div className="border-l-4 border-chart-2 pl-4">
                  <p className="font-medium">Normal Hours (9AM - 5PM)</p>
                  <p className="text-sm text-muted-foreground">Average bandwidth: 45% utilization</p>
                </div>
                <div className="border-l-4 border-chart-3 pl-4">
                  <p className="font-medium">Off-Peak Hours</p>
                  <p className="text-sm text-muted-foreground">Average bandwidth: 20% utilization</p>
                </div>
                <div className="border-l-4 border-chart-4 pl-4">
                  <p className="font-medium">Weekly Trend</p>
                  <p className="text-sm text-muted-foreground">Traffic increased 12% vs last week</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alert Trends Tab */}
        <TabsContent value="alerts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Reduction Trend (4 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={alertTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="errors" fill="hsl(var(--chart-1))" name="Errors" />
                  <Bar dataKey="warnings" fill="hsl(var(--chart-2))" name="Warnings" />
                  <Bar dataKey="info" fill="hsl(var(--chart-3))" name="Info" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Error Reduction</p>
                <p className="text-3xl font-bold text-green-500 mt-2">60%</p>
                <p className="text-xs text-muted-foreground mt-1">vs 4 weeks ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Alert Avg/Day</p>
                <p className="text-3xl font-bold text-primary mt-2">5.5</p>
                <p className="text-xs text-muted-foreground mt-1">down from 15.2</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">MTTR</p>
                <p className="text-3xl font-bold text-blue-500 mt-2">12m</p>
                <p className="text-xs text-muted-foreground mt-1">Mean Time to Resolution</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* QoS Distribution Tab */}
        <TabsContent value="qos" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>QoS Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qosDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qosDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QoS Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-chart-1 pl-4">
                  <p className="font-medium">Excellent Performance</p>
                  <p className="text-sm text-muted-foreground">45% of services exceed 95 QoS score</p>
                </div>
                <div className="border-l-4 border-chart-2 pl-4">
                  <p className="font-medium">Good Performance</p>
                  <p className="text-sm text-muted-foreground">35% maintain 85-95 QoS score</p>
                </div>
                <div className="border-l-4 border-chart-3 pl-4">
                  <p className="font-medium">Fair Performance</p>
                  <p className="text-sm text-muted-foreground">15% in 70-85 range</p>
                </div>
                <div className="border-l-4 border-chart-4 pl-4">
                  <p className="font-medium">Action Required</p>
                  <p className="text-sm text-muted-foreground">5% require immediate attention</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Performance Improvement</p>
              <p className="text-sm text-muted-foreground">
                Latency improved by 8% year-over-year with 99.82% availability
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">Alert Reduction</p>
              <p className="text-sm text-muted-foreground">
                Alerts reduced by 60% through optimized threshold configuration
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium">Peak Hour Management</p>
              <p className="text-sm text-muted-foreground">Network maintains 89% QoS during peak hours (6PM-8PM)</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-medium">Reliability Trend</p>
              <p className="text-sm text-muted-foreground">
                Mean Time to Resolution reduced to 12 minutes from 25 minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
