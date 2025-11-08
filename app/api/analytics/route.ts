import { NextResponse } from "next/server"

interface AnalyticsData {
  period: string
  avgLatency: number
  avgPacketLoss: number
  availability: number
  qosScore: number
  alertCount: number
  peakTraffic: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "7d"

  try {
    const analyticsData: AnalyticsData = {
      period,
      avgLatency: 14.3,
      avgPacketLoss: 0.019,
      availability: 99.82,
      qosScore: 92.3,
      alertCount: 10,
      peakTraffic: 85,
    }

    // Historical data for trends
    const trendData = Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      latency: Math.random() * 20 + 10,
      qosScore: Math.random() * 15 + 85,
      availability: 99 + Math.random() * 0.8,
    }))

    return NextResponse.json({
      success: true,
      summary: analyticsData,
      trends: trendData,
      period,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
