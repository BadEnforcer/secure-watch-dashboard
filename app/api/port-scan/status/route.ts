import { type NextRequest, NextResponse } from "next/server"

// In a real application, you'd store this in a database or Redis
const activeSessions = new Map<string, any>()

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 })
  }

  const session = activeSessions.get(sessionId)

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  return NextResponse.json(session)
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()
    const sessionId = crypto.randomUUID()

    activeSessions.set(sessionId, {
      ...sessionData,
      id: sessionId,
      startTime: new Date().toISOString(),
      status: "running",
    })

    return NextResponse.json({ sessionId, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
