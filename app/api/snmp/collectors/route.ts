import { NextResponse } from "next/server"

interface SNMPCollector {
  id: string
  host: string
  community: string
  port: number
  version: string
  status: "active" | "inactive" | "error"
  lastPolled: string
}

export async function GET() {
  try {
    const collectors: SNMPCollector[] = [
      {
        id: "1",
        host: "192.168.1.1",
        community: "public",
        port: 161,
        version: "v2c",
        status: "active",
        lastPolled: new Date(Date.now() - 2000).toISOString(),
      },
      {
        id: "2",
        host: "192.168.1.2",
        community: "public",
        port: 161,
        version: "v2c",
        status: "active",
        lastPolled: new Date(Date.now() - 5000).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: collectors,
      count: collectors.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch collectors" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newCollector: SNMPCollector = {
      id: String(Date.now()),
      host: body.host,
      community: body.community,
      port: body.port,
      version: body.version,
      status: "active",
      lastPolled: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newCollector,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create collector" }, { status: 400 })
  }
}
