import { NextResponse } from "next/server"

interface ComplianceRecord {
  id: string
  name: string
  status: "compliant" | "warning" | "critical"
  sla: number
  threshold: string
  timestamp: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  try {
    const complianceRecords: ComplianceRecord[] = [
      {
        id: "1",
        name: "Latency SLA (< 50ms)",
        status: "compliant",
        sla: 99.9,
        threshold: "< 50ms",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Packet Loss (< 0.1%)",
        status: "compliant",
        sla: 99.95,
        threshold: "< 0.1%",
        timestamp: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Availability SLA (> 99%)",
        status: "compliant",
        sla: 99.8,
        threshold: "> 99%",
        timestamp: new Date().toISOString(),
      },
      {
        id: "4",
        name: "QoS Score (> 90)",
        status: "warning",
        sla: 88.5,
        threshold: "> 90",
        timestamp: new Date().toISOString(),
      },
    ]

    const filtered = status ? complianceRecords.filter((r) => r.status === status) : complianceRecords

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch compliance records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const record: ComplianceRecord = {
      id: String(Date.now()),
      name: body.name,
      status: body.status,
      sla: body.sla,
      threshold: body.threshold,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create compliance record" }, { status: 400 })
  }
}
