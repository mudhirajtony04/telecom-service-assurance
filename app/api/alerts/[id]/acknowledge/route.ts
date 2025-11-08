import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    return NextResponse.json({
      success: true,
      data: {
        id,
        acknowledged: true,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to acknowledge alert" }, { status: 400 })
  }
}
