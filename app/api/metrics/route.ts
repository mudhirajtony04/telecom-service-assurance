import { NextResponse } from "next/server"

interface MetricsData {
  latency: number
  packetLoss: number
  qosScore: number
  bandwidth: number
  timestamp: string
}

// Simulated metrics data store
const metricsHistory: MetricsData[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "24h"
  const limit = Number.parseInt(searchParams.get("limit") || "100")

  try {
    const mockMetrics: MetricsData[] = Array.from({ length: Math.min(limit, 50) }, (_, i) => ({
      latency: Math.random() * 40 + 5,
      packetLoss: Math.random() * 0.08,
      qosScore: Math.random() * 20 + 80,
      bandwidth: Math.random() * 50 + 40,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: mockMetrics.reverse(),
      timeRange,
      count: mockMetrics.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch metrics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newMetric: MetricsData = {
      latency: body.latency,
      packetLoss: body.packetLoss,
      qosScore: body.qosScore,
      bandwidth: body.bandwidth,
      timestamp: new Date().toISOString(),
    }

    metricsHistory.push(newMetric)

    // Keep only last 1000 entries
    if (metricsHistory.length > 1000) {
      metricsHistory.shift()
    }

    return NextResponse.json({
      success: true,
      data: newMetric,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to store metrics" }, { status: 400 })
  }
}
