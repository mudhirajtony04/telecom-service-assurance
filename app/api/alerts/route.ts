import { NextResponse } from "next/server"

interface Alert {
  id: string
  type: "error" | "warning" | "info"
  title: string
  description: string
  source: string
  acknowledged: boolean
  timestamp: string
}

// Simulated alerts store
const alertsStore: Alert[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const acknowledged = searchParams.get("acknowledged")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  try {
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "error",
        title: "High Latency Detected",
        description: "Link-1 experiencing 250ms latency",
        source: "network-monitor",
        acknowledged: false,
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      },
      {
        id: "2",
        type: "warning",
        title: "Bandwidth Alert",
        description: "Interface eth0 at 92% utilization",
        source: "bandwidth-monitor",
        acknowledged: false,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: "3",
        type: "info",
        title: "Configuration Updated",
        description: "SNMP threshold modified for QoS",
        source: "system",
        acknowledged: true,
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      },
    ]

    let filtered = mockAlerts

    if (type) {
      filtered = filtered.filter((a) => a.type === type)
    }

    if (acknowledged !== null) {
      const ackBool = acknowledged === "true"
      filtered = filtered.filter((a) => a.acknowledged === ackBool)
    }

    return NextResponse.json({
      success: true,
      data: filtered.slice(0, limit),
      total: filtered.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const alert: Alert = {
      id: String(Date.now()),
      type: body.type,
      title: body.title,
      description: body.description,
      source: body.source || "api",
      acknowledged: false,
      timestamp: new Date().toISOString(),
    }

    alertsStore.push(alert)

    return NextResponse.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create alert" }, { status: 400 })
  }
}
